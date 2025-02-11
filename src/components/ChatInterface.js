import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Typography, Paper, Input } from "@mui/material";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { PDFDocument } from "pdf-lib";

const ChatInterface = () => {
  const location = useLocation();
  const initialMessage = location.state?.initialMessage || ""; // Gets message from homepage
  const [message, setMessage] = useState(initialMessage);
  const [chat, setChat] = useState([]);
  const [file, setFile] = useState(null); // Store the uploaded file

  useEffect(() => {
    if (initialMessage) {
      handleSendMessage(initialMessage);
    }
  }, [initialMessage]);

  const handleSendMessage = async (msg) => {
    if (!msg.trim()) return;

    const userMessage = { role: "user", text: msg };
    setChat((prev) => [...prev, userMessage]);

    try {
      const result = await axios.post("/api/chat", { message: msg });
      const botMessage = { role: "bot", text: result.data[0]?.generated_text || "No response" };
      setChat((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error communicating with the AI:", error);
    }

    setMessage(""); // Clear input after sending the message
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setFile(file);
      const content = await extractTextFromPDF(file);
      handleSendMessage(content); // should the extracted PDF content to the bot
    }
  };

  const extractTextFromPDF = async (pdfFile) => {
    const fileReader = new FileReader();
    return new Promise((resolve, reject) => {
      fileReader.onload = async () => {
        try {
          const uint8Array = new Uint8Array(fileReader.result);
          const pdfDoc = await PDFDocument.load(uint8Array);
          const text = await pdfDoc.getText(); // should extract text from the PDF
          resolve(text);
        } catch (error) {
          reject("Failed to extract text from PDF");
        }
      };
      fileReader.onerror = (error) => reject("Failed to read file");
      fileReader.readAsArrayBuffer(pdfFile);
    });
  };

  return (
    <Box sx={{ maxWidth: "600px", margin: "auto", mt: 4, p: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ color: "#2560b9" }}>
        Chat with RevisionBot
      </Typography>

      <Paper sx={{ maxHeight: "300px", overflowY: "auto", p: 2 }}>
        {chat.map((msg, index) => (
          <Typography key={index} align={msg.role === "user" ? "right" : "left"}>
            <strong>{msg.role === "user" ? "You: " : "Bot: "}</strong> {msg.text}
          </Typography>
        ))}
      </Paper>

      <Box sx={{ display: "flex", mt: 2, gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask RevisionBot..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button variant="contained" onClick={() => handleSendMessage(message)}>
          Send
        </Button>
      </Box>

      {/* File upload input */}
      <Box sx={{ mt: 2 }}>
        <Input
          type="file"
          accept="application/pdf"
          onChange={handleFileUpload}
        />
      </Box>
    </Box>
  );
};

export default ChatInterface;
