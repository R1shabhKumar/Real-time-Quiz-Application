

export const buildFrequencyTable = (text) => {
    const freqTable = new Map();
    for (const char of text) {
        freqTable.set(char, (freqTable.get(char) || 0) + 1);
    }
    return freqTable;
};


export const buildHuffmanTree = (freqTable) => {
    
    const priorityQueue = Array.from(freqTable.entries()).map(([char, freq]) => ({ char, freq, left: null, right: null }));


    priorityQueue.sort((a, b) => a.freq - b.freq); 

    while (priorityQueue.length > 1) {
        
        const left = priorityQueue.shift();
        const right = priorityQueue.shift();

        
        const parent = { char: null, freq: left.freq + right.freq, left, right };

        
        priorityQueue.push(parent);

        
        priorityQueue.sort((a, b) => a.freq - b.freq); 
    }

    
    return priorityQueue[0];
};


export const buildHuffmanCodeMap = (node, prefix = '', codeMap = new Map()) => {
    if (node.char !== null) {
        codeMap.set(node.char, prefix);
    } else {
        if (node.left) buildHuffmanCodeMap(node.left, prefix + '0', codeMap);
        if (node.right) buildHuffmanCodeMap(node.right, prefix + '1', codeMap);
    }
    return codeMap;
};


export const encodeText = (text, codeMap) => {
    return text
        .split('')
        .map((char) => codeMap.get(char)) 
        .join(''); 
};


export const decodeText = (encodedText, huffmanTree) => {
    let decodedText = '';
    let currentNode = huffmanTree;
    for (const bit of encodedText) {
        currentNode = bit === '0' ? currentNode.left : currentNode.right;
        if (currentNode.char !== null) {
            decodedText += currentNode.char;
            currentNode = huffmanTree;
        }
    }
    return decodedText;
};


export const getKeyValuePairs = (map) => {
    return Array.from(map.entries()).map(([key, value]) => ({ key, value }));
};


export const getCharacterFrequency = (freqTable, char) => {
    return freqTable.get(char) || 0; 
};

