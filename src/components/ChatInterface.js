import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown"; // ✅ Markdown rendering

const ChatInterface = () => {
  const location = useLocation();
  const initialMessage = location.state?.initialMessage || "";

  const [message, setMessage] = useState(initialMessage);
  const [chat, setChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedModule, setSelectedModule] = useState("");

  const hasSentInitialMessage = useRef(false);
  const chatBoxRef = useRef(null);

  const formatModuleName = (name) => name.replace(/ /g, "_");
  const formatDisplayName = (name) => name.replace(/_/g, " ");

  useEffect(() => {
    if (initialMessage && !hasSentInitialMessage.current) {
      startNewSession(initialMessage);
      hasSentInitialMessage.current = true;
    }
  }, [initialMessage]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chat]);

  const startNewSession = async (moduleName) => {
    const formattedModule = formatModuleName(moduleName);
    setSelectedModule(formattedModule);
    setChat([]);
    setIsLoading(true);
    setError("");

    try {
      const systemMessage = `You are now assisting with ${formattedModule}. Please focus only on this module.`;
      const response = await axios.post("http://127.0.0.1:5000/query", {
        query: systemMessage,
        module: formattedModule,
      });

      console.log("API Response:", response.data);

      const displayName = formatDisplayName(formattedModule);
      const updatedResponse =
        response.data?.response?.replace(formattedModule, displayName) ||
        "No response";

      setChat([{ role: "bot", text: updatedResponse }]);
    } catch (error) {
      console.error("Error starting new session:", error);
      setError("Failed to start a new session. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (msg) => {
    if (!msg.trim()) return;

    setIsLoading(true);
    setError("");

    setChat((prev) => [...prev, { role: "user", text: msg }]);

    try {
      const response = await axios.post("http://127.0.0.1:5000/query", {
        query: msg,
        module: selectedModule,
      });

      console.log("API Response:", response.data);

      const botResponse = response.data?.response || "No response";

      setChat((prev) => [...prev, { role: "bot", text: botResponse }]);
    } catch (error) {
      console.error("Error communicating with the AI:", error);
      setError(
        "Failed to send message. Please check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }

    setMessage("");
  };

  return (
    <Box sx={{ maxWidth: "800px", margin: "auto", mt: 4, p: 2 }}>
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{ color: "#2560b9", fontWeight: "bold" }}
      >
        BCU RevisionBot
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        sx={{ color: "#666", mb: 4 }}
      >
        Ask questions, upload PDFs, and get instant help with your studies.
      </Typography>

      <Paper
        ref={chatBoxRef}
        sx={{
          height: "400px",
          overflowY: "auto",
          p: 2,
          backgroundColor: "#f5f5f5",
          borderRadius: 2,
          mb: 2,
        }}
      >
        {chat.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              mb: 2,
            }}
          >
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                maxWidth: "75%",
                backgroundColor:
                  msg.role === "user" ? "#2196f3" : "#e0e0e0",
                color: msg.role === "user" ? "white" : "black",
                wordWrap: "break-word",
                whiteSpace: "pre-wrap",
              }}
            >
              <strong>{msg.role === "user" ? "You: " : "Bot: "}</strong>
              {msg.role === "bot" ? (
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              ) : (
                msg.text
              )}
            </Box>
          </Box>
        ))}
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask RevisionBot..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage(message)}
          disabled={isLoading}
        />
        <Button
          variant="contained"
          onClick={() => handleSendMessage(message)}
          disabled={!message.trim() || isLoading}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatInterface;
