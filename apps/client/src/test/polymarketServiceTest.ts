/**
 * Test file for PolymarketService
 * This file tests the comprehensive PolymarketService to ensure it's working correctly
 */

import {
  PolymarketService,
  PolymarketApiError,
} from "@/modules/polymarket.module";

/**
 * Test the basic markets endpoint
 */
export async function testBasicMarkets() {
  console.log("🧪 Testing basic markets endpoint...");

  try {
    const markets = await PolymarketService.getMarkets({ limit: 3 });
    console.log(`✅ Successfully fetched ${markets.length} markets`);

    if (markets.length > 0) {
      const firstMarket = markets[0];
      console.log(`📊 First market: ${firstMarket.question}`);
      console.log(
        `💰 Volume: $${firstMarket.volumeNum?.toLocaleString() || "N/A"}`
      );
      console.log(`🔄 Active: ${firstMarket.active}`);
    }

    return markets;
  } catch (error) {
    console.error("❌ Failed to fetch markets:", error);
    return [];
  }
}

/**
 * Test market search functionality
 */
export async function testMarketSearch() {
  console.log("\n🔍 Testing market search...");

  try {
    const searchResults = await PolymarketService.searchMarkets("election", {
      limit: 5,
      order: "volume",
      activeOnly: true,
    });

    console.log(`✅ Search returned ${searchResults.length} markets`);

    searchResults.forEach((market, index) => {
      console.log(`${index + 1}. ${market.question}`);
      console.log(`   Volume: $${market.volumeNum?.toLocaleString() || "N/A"}`);
      console.log(`   Active: ${market.active}`);
    });

    return searchResults;
  } catch (error) {
    console.error("❌ Market search failed:", error);
    return [];
  }
}

/**
 * Test public search functionality
 */
export async function testPublicSearch() {
  console.log("\n🌐 Testing public search...");

  try {
    const searchResults = await PolymarketService.publicSearch({
      q: "election",
      limit_per_type: 3,
      search_tags: true,
      search_profiles: false,
    });

    console.log(`✅ Public search results:`);
    console.log(`   Events: ${searchResults.events.length}`);
    console.log(`   Tags: ${searchResults.tags.length}`);
    console.log(`   Profiles: ${searchResults.profiles.length}`);
    console.log(`   Total Results: ${searchResults.pagination.totalResults}`);

    if (searchResults.events.length > 0) {
      console.log(`📅 First event: ${searchResults.events[0].title}`);
    }

    if (searchResults.tags.length > 0) {
      console.log(
        `🏷️  First tag: ${searchResults.tags[0].label} (${searchResults.tags[0].event_count} events)`
      );
    }

    return searchResults;
  } catch (error) {
    console.error("❌ Public search failed:", error);
    return null;
  }
}

/**
 * Test trending markets
 */
export async function testTrendingMarkets() {
  console.log("\n📈 Testing trending markets...");

  try {
    const trending = await PolymarketService.getTrendingMarkets(3);
    console.log(`✅ Found ${trending.length} trending markets`);

    trending.forEach((market, index) => {
      console.log(`${index + 1}. ${market.question}`);
      console.log(`   Volume: $${market.volumeNum?.toLocaleString() || "N/A"}`);
      console.log(`   24h Change: ${market.oneDayPriceChange || 0}%`);
    });

    return trending;
  } catch (error) {
    console.error("❌ Failed to get trending markets:", error);
    return [];
  }
}

/**
 * Test error handling
 */
export async function testErrorHandling() {
  console.log("\n⚠️  Testing error handling...");

  try {
    // This should fail with a 404
    await PolymarketService.getMarket("invalid-market-id");
    console.log("❌ Expected error but got success");
  } catch (error) {
    if (error instanceof PolymarketApiError) {
      console.log(
        `✅ Correctly caught API error: ${error.status} - ${error.message}`
      );
    } else {
      console.log(`❌ Unexpected error type: ${error}`);
    }
  }
}

/**
 * Run all tests
 */
export async function runAllTests() {
  console.log("🚀 Starting PolymarketService tests...\n");

  const results = {
    basicMarkets: await testBasicMarkets(),
    marketSearch: await testMarketSearch(),
    publicSearch: await testPublicSearch(),
    trendingMarkets: await testTrendingMarkets(),
  };

  await testErrorHandling();

  console.log("\n📊 Test Summary:");
  console.log(`   Basic Markets: ${results.basicMarkets.length} markets`);
  console.log(`   Market Search: ${results.marketSearch.length} results`);
  console.log(
    `   Public Search: ${results.publicSearch ? "Success" : "Failed"}`
  );
  console.log(`   Trending Markets: ${results.trendingMarkets.length} markets`);

  console.log("\n✅ All tests completed!");

  return results;
}

// Export for easy testing
export const tests = {
  testBasicMarkets,
  testMarketSearch,
  testPublicSearch,
  testTrendingMarkets,
  testErrorHandling,
  runAllTests,
};
