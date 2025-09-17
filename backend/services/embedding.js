// Placeholder embedding service
// Replace with real Jina embeddings or any other embeddings provider
module.exports = {
  async embedText(text) {
    // Simple numeric "embedding" stub - in production use real embeddings
    const hash = text.split('').reduce((s,c)=>s + c.charCodeAt(0), 0);
    // return an array-like embedding
    return Array.from({length: 8}, (_,i) => (hash + i) % 100 / 100.0);
  },

  async retrieveSimilar(queryEmbedding, k=3) {
    // Placeholder: return k dummy "documents"
    const dummy = [
      "Breaking: Central bank announces new rates and monetary policy updates affecting markets worldwide.",
      "Sports: Local football team wins championship in a thrilling final that went to extra time.",
      "Tech: New open-source library simplifies embedding pipelines and vector database integration for developers.",
      "Economy: Global markets react to new trade agreements and supply chain updates.",
      "Science: Researchers release a study on efficient transformer pruning techniques to speed up inference."
    ];
    return dummy.slice(0,k);
  }
};
