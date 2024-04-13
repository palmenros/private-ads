export const getEmbeddings = (interestPickerSelectedItem) => {  
    let embeddingsStr = null;
  
    if(Array.isArray(interestPickerSelectedItem)) {
      embeddingsStr = interestPickerSelectedItem;
    } else {
      embeddingsStr = interestPickerSelectedItem.value;
    }
  
    let embeddings = embeddingsStr.map(x => parseFloat(x))
    console.log(embeddings)
  
    const EMBEDDING_SCALING_CONSTANT = 1000;
  
    let embeddingX = Math.round(embeddings[0] * EMBEDDING_SCALING_CONSTANT)
    let embeddingY = Math.round(embeddings[1] * EMBEDDING_SCALING_CONSTANT)
    return [embeddingX, embeddingY];
};
  