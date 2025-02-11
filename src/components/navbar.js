const modules = {
    foundation: [
      "CMP3009 Foundations of Programming A S2 2021/2",
      "CMP3010 Fundamental Mathematics A S1 2021/2",
      "CMP3012 Web Application Design A S1 2021/2",
      "CMP3013 Audio / Video Fundamentals A S2 2021/2"
    ],
    year1: [
      "CMP4266 Computer Programming A S1 2022/3",
      "CMP4267 Computer Systems A S1 2022/3",
      "CMP4269 Network Fundamentals A S2 2022/3",
      "CMP4272 Data Structures and Algorithms B S2 2022/3"
    ],
    year2: [
      "CMP4285 Innovation Project A S2 2022/3",
      "CMP5329 Cyber Security A S2 2023/4",
      "CMP5332 Object Oriented Programming A S1 2023/4",
      "CMP5354 Software Design A S2 2023/4"
    ],
    year3: [
      "CMP5361 Computer Mathematics and Declarative Programming A S2 2023/4",
      "CMP5371 Operating Systems and DevOps A S1 2023/4",
      "CMP6200/DIG6200 Individual Honours Project A AYR 2024/5",
      "CMP6202 Artificial Intelligence and Machine Learning A S1 2024/5",
      "CMP6210 Cloud Computing A S2 2024/5",
      "CMP6213 Mobile and Wearable Application Development A S2 2024/5",
      "CMP6214 User Experience Design A S1 2024/5"
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
      <Container maxWidth="md" sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", padding: 2 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: "#2560b9" }}>
          What modules would you like help with?
        </Typography>
  
        {/* Search Input Section */}
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center", gap: 2, mb: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter module name"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <Button variant="contained" onClick={handleStartChat}>Start Chat</Button>
        </Box>
  
        {/* Display Modules */}
        <Box width="100%" sx={{ marginTop: 4 }}>
          {Object.keys(modules).map((year, index) => (
            <Box key={index} mt={2}>
              <Typography variant="h6" fontWeight="medium" sx={{ color: "#2560b9" }}>{year.charAt(0).toUpperCase() + year.slice(1)} Modules</Typography>
  
              {/* Display Modules in Grid */}
              <Grid container spacing={2} mt={2}>
                {modules[year].map((module, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Paper
                      sx={{
                        p: 2,
                        cursor: "pointer",
                        textAlign: "center",
                        border: "1px solid #ddd",
                        "&:hover": { backgroundColor: "#f5f5f5" },
                        transition: "background-color 0.3s ease"
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
  