import React, { useState, useCallback } from 'react';
import { File, FilePlus, FileX, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { buildFrequencyTable, buildHuffmanTree, buildHuffmanCodeMap, encodeText, decodeText, getKeyValuePairs, getCharacterFrequency } from '../utils/huffman';

const Compression = () => {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [huffmanTree, setHuffmanTree] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [keyValuePairs, setKeyValuePairs] = useState([]); // State to store key-value pairs
    const [showKeyValuePairs, setShowKeyValuePairs] = useState(false); // State to toggle display

    const handleCompress = useCallback(() => {
        if (!inputText.trim()) {
            setError('Please enter text to compress.');
            return;
        }
        setError(null);
        setLoading(true);
        setOutputText('');
        try {
            const freqTable = buildFrequencyTable(inputText);
            const tree = buildHuffmanTree(freqTable);
            const codeMap = buildHuffmanCodeMap(tree);
            const encodedText = encodeText(inputText, codeMap);
            setOutputText(encodedText);
            setHuffmanTree(tree);
        } catch (err) {
            setError('Compression failed.');
            setOutputText('');
        } finally {
            setLoading(false);
        }
    }, [inputText]);

    const handleDecompress = useCallback(() => {
        if (!outputText.trim()) {
            setError('Please enter compressed text to decompress.');
            return;
        }
        if (!huffmanTree) {
            setError('Huffman tree is missing. Please compress text first.');
            return;
        }
        setError(null);
        setLoading(true);
        try {
            const decodedText = decodeText(outputText, huffmanTree);
            setInputText(decodedText);
        } catch (err) {
            setError('Decompression failed.');
            setInputText('');
        } finally {
            setLoading(false);
        }
    }, [outputText, huffmanTree]);

    const handleClearInput = () => {
        setInputText('');
        setError(null);
    };

    const handleClearOutput = () => {
        setOutputText('');
        setError(null);
    };

    const handleShowKeyValuePairs = () => {
        if (!huffmanTree) {
            setError('Huffman tree is missing. Please compress text first.');
            return;
        }
        setError(null);
        const freqTable = buildFrequencyTable(inputText);
        const codeMap = buildHuffmanCodeMap(huffmanTree);
        const pairs = getKeyValuePairs(codeMap).map((pair) => ({
            ...pair,
            frequency: getCharacterFrequency(freqTable, pair.key), // Add frequency to each pair
        }));
        setKeyValuePairs(pairs);
        setShowKeyValuePairs(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    Huffman Coding Tool
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Input Section */}
                    <div className="space-y-4">
                        <textarea
                            placeholder="Enter text to compress..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            className="min-h-[160px] bg-gray-800 text-white border-gray-700 placeholder:text-gray-400 w-full p-4 rounded-lg focus:ring-2 focus:ring-blue-400"
                            disabled={loading}
                            rows={6}
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={handleCompress}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600"
                            >
                                Encode
                            </button>
                            <button
                                onClick={handleClearInput}
                                disabled={loading}
                                className="px-4 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600"
                            >
                                Clear Input
                            </button>
                        </div>
                    </div>

                    {/* Output Section */}
                    <div className="space-y-4">
                        <textarea
                            placeholder="Compressed output will appear here..."
                            value={outputText}
                            onChange={(e) => setOutputText(e.target.value)}
                            className="min-h-[160px] bg-gray-800 text-white border-gray-700 placeholder:text-gray-600 w-full p-4 rounded-lg focus:ring-2 focus:ring-purple-400"
                            readOnly
                            rows={6}
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={handleDecompress}
                                disabled={loading}
                                className="px-4 py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600"
                            >
                                Decode
                            </button>
                            <button
                                onClick={handleClearOutput}
                                disabled={loading}
                                className="px-4 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600"
                            >
                                Clear Output
                            </button>
                        </div>
                    </div>
                </div>

                {/* Show Key-Value Pairs Button */}
                <div className="flex justify-center mt-4">
                    <button
                        onClick={handleShowKeyValuePairs}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600"
                    >
                        Show Key-Value Pairs
                    </button>
                </div>

                {/* Key-Value Pairs Display */}
                {showKeyValuePairs && (
                    <div className="mt-6 bg-gray-800 text-white p-4 rounded-lg">
                        <h2 className="text-lg font-semibold mb-4">Key-Value Pairs</h2>
                        <ul className="space-y-2">
                            {keyValuePairs.map((pair, index) => (
                                <li key={index} className="flex justify-between">
                                    <span className="font-bold">{pair.key}</span>
                                    <span>{pair.value}</span>
                                    <span className="text-gray-400">({pair.frequency} occurrences)</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-md">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Compression;
