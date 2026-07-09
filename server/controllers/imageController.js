

exports.generateOutputImage = async (req, res) => {
  try {
    const { problemStatement } = req.body;

    if (!problemStatement) {
      return res.status(400).json({ error: "problemStatement is required" });
    }

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    if (!OPENROUTER_API_KEY) {
      return res.status(500).json({ error: "OPENROUTER_API_KEY not configured" });
    }

    const prompt = `Generate an output image showing:
- terminal output
- IDE screenshot
- graph
- visualization
- chart
- GUI
- browser
- console
whichever is appropriate as per the experiment. 
Experiment details: ${problemStatement}`;

    console.log("Generating image for:", problemStatement);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "black-forest-labs/flux.2-klein-4b",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    console.log("Data:", data);
    
    if (!response.ok) {
      throw new Error(data.error?.message || "Image generation failed");
    }

    // Seedream on OpenRouter returns the image in the 'images' array or 'content'
    const message = data.choices[0].message;

    let imageUrl = "";

    if (message.images && message.images.length > 0) {
      // Base64 or URL from images array
      imageUrl = message.images[0].image_url?.url || message.images[0].url;
      
    } else if (message.content) {
      const content = message.content;
      console.log("Image generation response:", content);

      // Extract URL from Markdown ![...](URL) or raw URL
      const urlMatch = content.match(/!\[.*?\]\((.*?)\)/) || content.match(/(https?:\/\/[^\s]+)/);
      
      if (urlMatch && urlMatch[1]) {
        imageUrl = urlMatch[1];
      } else if (content.startsWith("http") || content.startsWith("data:image")) {
        imageUrl = content.trim();
      } else {
        // In case it returns JSON with URL
        try {
          const parsed = JSON.parse(content);
          if (parsed.url) imageUrl = parsed.url;
        } catch (e) {
          throw new Error("Could not parse image URL from response content");
        }
      }
    }

    if (!imageUrl) {
      throw new Error("No image URL found in response");
    }

    res.json({ imageUrl });
  } catch (error) {
    console.error("Error generating output image:", error);
    res.status(500).json({ error: error.message || "Failed to generate image" });
  }
};
