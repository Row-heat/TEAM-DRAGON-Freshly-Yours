const axios = require("axios")

/**
 * Product name mapping for better image search results
 */
const productSearchTerms = {
  // Vegetables
  "tomato": "tomato red fresh vegetable",
  "potato": "potato fresh vegetable",
  "onion": "onion fresh vegetable",
  "green chilli": "green chili pepper hot",
  "chilli": "chili pepper hot red",
  "cabbage": "cabbage fresh green vegetable",
  "brinjal": "eggplant aubergine purple vegetable",
  "eggplant": "eggplant aubergine purple vegetable",
  "capsicum": "bell pepper colorful vegetable",
  "bottle gourd": "bottle gourd lauki vegetable",
  "ridgeguard": "ridge gourd vegetable green",
  "tori": "ridge gourd vegetable green",
  
  // Fruits
  "banana": "banana yellow fresh fruit",
  "lime": "lime green citrus fruit",
  "lemon": "lemon yellow citrus fruit",
  "mousambi": "sweet lime citrus fruit",
  "sweet lime": "sweet lime citrus fruit",
  
  // Grains & Cereals
  "maize": "corn maize yellow grain",
  "corn": "corn maize yellow grain",
  "bajra": "pearl millet grain cereal",
  "pearl millet": "pearl millet grain cereal",
  "jowar": "sorghum grain cereal",
  "sorghum": "sorghum grain cereal",
  
  // Pulses & Legumes
  "groundnut": "peanut groundnut nuts",
  "peanut": "peanut groundnut nuts",
  "bengal gram": "chickpea gram legume",
  "chickpea": "chickpea gram legume",
  "gram": "chickpea gram legume pulse",
  "green gram": "mung bean green gram",
  "moong": "mung bean green gram",
  "arhar": "pigeon pea red gram",
  "red gram": "pigeon pea red gram",
  "tur": "pigeon pea red gram",
  
  // Seeds & Oil crops
  "mustard": "mustard seeds yellow",
  "sesame": "sesame seeds white",
  "sesamum": "sesame seeds white",
  "til": "sesame seeds white",
  "soyabean": "soybean seeds",
  "castor seed": "castor bean seeds",
  "cotton": "cotton white fiber crop",
  "suva": "dill seeds herb",
  "dill seed": "dill seeds herb",
  
  // Spices & Herbs
  "ginger": "ginger root fresh",
  "rajgir": "amaranth grain seeds",
  "amaranth": "amaranth grain seeds"
}

/**
 * Get optimized search terms for a product
 */
function getSearchTerms(productName, category = "food") {
  const cleanName = productName.toLowerCase()
    .replace(/\(.*?\)/g, '') // Remove parentheses and content
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim()
  
  // Check for specific mappings
  for (const [key, terms] of Object.entries(productSearchTerms)) {
    if (cleanName.includes(key) || key.includes(cleanName)) {
      return terms
    }
  }
  
  // Fallback to generic terms
  const genericTerms = [
    cleanName,
    category === "food" ? "fresh" : "",
    category === "food" ? "organic" : "",
    "agriculture"
  ].filter(Boolean).join(" ")
  
  return genericTerms
}

/**
 * Fetch product image from Pixabay API
 * @param {string} productName - Name of the product to search for
 * @param {string} category - Category hint for better search results
 * @returns {Promise<string|null>} - Image URL or null if not found
 */
async function fetchProductImage(productName, category = "food") {
  try {
    // Check if Pixabay API key is available
    if (!process.env.PIXABAY_API_KEY || process.env.PIXABAY_API_KEY === 'your-pixabay-api-key-here') {
      console.log(`No valid Pixabay API key found, using placeholder for: ${productName}`)
      return {
        url: `https://placehold.co/400x300/4CAF50/white?text=${encodeURIComponent(productName)}`,
        description: `${productName} - placeholder image`,
        source: "placeholder"
      }
    }

    // Get optimized search terms
    const searchTerms = getSearchTerms(productName, category)
    console.log(`Searching for "${productName}" using terms: "${searchTerms}"`)

    const response = await axios.get(process.env.PIXABAY_API_URL, {
      params: {
        key: process.env.PIXABAY_API_KEY,
        q: searchTerms,
        image_type: "photo",
        category: "food",
        per_page: 10,
        safesearch: "true",
        min_width: 300,
        min_height: 200,
        order: "popular",
      },
      timeout: 5000, // 5 second timeout
    })

    const hits = response.data.hits || []
    
    if (hits.length > 0) {
      // Return the best quality image available
      const image = hits[0]
      return {
        url: image.webformatURL,
        thumbnail: image.previewURL,
        tags: image.tags,
        id: image.id,
      }
    }

    // If no results, try a more generic search
    console.log(`No specific image found for "${searchTerms}", trying generic search...`)
    
    const genericResponse = await axios.get(process.env.PIXABAY_API_URL, {
      params: {
        key: process.env.PIXABAY_API_KEY,
        q: "fresh vegetables fruits food",
        image_type: "photo",
        category: "food",
        per_page: 5,
        safesearch: "true",
        min_width: 300,
        min_height: 200,
      },
      timeout: 5000,
    })

    const genericHits = genericResponse.data.hits || []
    if (genericHits.length > 0) {
      const image = genericHits[Math.floor(Math.random() * genericHits.length)]
      return {
        url: image.webformatURL,
        thumbnail: image.previewURL,
        tags: image.tags,
        id: image.id,
      }
    }

    return null
  } catch (error) {
    console.error(`Error fetching image for "${productName}":`, error.message)
    // Return a simple colored placeholder image
    return {
      url: `https://placehold.co/400x300/4CAF50/white?text=${encodeURIComponent(productName.substring(0, 20))}`,
      description: `${productName} - placeholder image`,
      source: "placeholder"
    }
  }
}

/**
 * Add delay to avoid API rate limiting
 * @param {number} ms - Milliseconds to wait
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Fetch images for multiple products with rate limiting
 * @param {Array} products - Array of products
 * @param {number} delayMs - Delay between requests in milliseconds
 */
async function fetchImagesForProducts(products, delayMs = 3000) {
  const results = []
  
  // Limit to only 10 products to avoid rate limiting
  const limitedProducts = products.slice(0, 10)
  console.log(`Processing ${limitedProducts.length} products for images...`)
  
  for (let i = 0; i < limitedProducts.length; i++) {
    const product = limitedProducts[i]
    
    // Add delay to respect API rate limits (3 seconds between requests)
    if (i > 0) {
      await delay(delayMs)
    }
    
    const imageData = await fetchProductImage(product.name || product.commodity, product.category)
    
    if (imageData) {
      results.push({
        ...product,
        image: imageData.url,
        thumbnail: imageData.thumbnail,
        imageTags: imageData.tags,
        imageId: imageData.id,
      })
    } else {
      console.log(`Skipping product "${product.name || product.commodity}" - no image found`)
    }
  }
  
  console.log(`Successfully processed ${results.length} products with images`)
  return results
}

module.exports = {
  fetchProductImage,
  fetchImagesForProducts,
  delay,
}
