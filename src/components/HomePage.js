import { useState } from "react";
import { Box, TextField, Button, Typography, Paper, Container, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

// categorized by year
const modules = {
  foundation: [
    "CMP3009 Foundations of Programming",
    "CMP3010 Fundamental Mathematics",
    "CMP3012 Web Application Design",
    "CMP3013 Audio / Video Fundamentals"
  ],
  year1: [
    "CMP4266 Computer Programming",
    "CMP4267 Computer Systems",
    "CMP4269 Network Fundamentals",
    "CMP4272 Data Structures and Algorithms",
    "CMP4285 Innovation Project",
    "DIG4166 Website Design and Development"
  ],
  year2: [
    "DIG5127 Database and Web Application Development",
    "CMP5371 Operating Systems and DevOps",
    "CMP5361 Computer Mathematics and Declarative Programming",
    "CMP5354 Software Design",
    "CMP5332 Object Oriented Programming",
    "CMP5329 Cyber Security",
  ],
  year3: [
    "CMP6200/DIG6200 Individual Honours Project",
    "CMP6202 Artificial Intelligence and Machine Learning",
    "CMP6210 Cloud Computing",
    "CMP6213 Mobile and Wearable Application Development",
    "CMP6214 User Experience Design"
  ]
};

export default function HomePage() {
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState("");
  const [selectedModule, setSelectedModule] = useState("");

  const handleStartChat = () => {
    if (selectedModule) {
      navigate("/chat", { state: { initialMessage: `Help me with ${selectedModule}` } });
    } else if (userInput) {
      navigate("/chat", { state: { initialMessage: userInput } });
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Title */}
      <Typography variant="h4" fontWeight="bold" align="center" sx={{ color: "#2560b9", mb: 4 }}>
        RevisionBot
      </Typography>

      {/* Search Input Section */}
      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Select a module and start chat!"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <Button variant="contained" onClick={handleStartChat} disabled={!userInput && !selectedModule}>
          Start Chat
        </Button>
      </Box>

      {/* Displays Modules */}
      <Box>
        {Object.keys(modules).map((year, index) => (
          <Box key={index} mb={4}>
            <Typography variant="h6" fontWeight="medium" sx={{ color: "#2560b9", mb: 2 }}>
              {year.charAt(0).toUpperCase() + year.slice(1)} Modules
            </Typography>

            {/* Display Modules in Grid */}
            <Grid container spacing={2}>
              {modules[year].map((module, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper
                    sx={{
                      p: 2,
                      cursor: "pointer",
                      textAlign: "center",
                      border: selectedModule === module ? "2px solid #2560b9" : "1px solid #ddd",
                      backgroundColor: selectedModule === module ? "#e3f2fd" : "#fff",
                      "&:hover": { backgroundColor: "#f5f5f5" },
                      transition: "all 0.3s ease"
                    }}
                    onClick={() => setSelectedModule(module)}
                  >
                    {module}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Box>
    </Container>
  );
}