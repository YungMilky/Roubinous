import React, { useState, useEffect } from "react";

function DifficultyToStarConverter({ difficulty }) {
  const [stars, setStars] = useState();
  useEffect(() => {
    if (difficulty === "Low") {
      setStars("★☆☆");
    } else if (difficulty === "Medium") {
      setStars("★★☆");
    } else if (difficulty === "High") {
      setStars("★★★");
    }
  }, []);

  return setStars;
}

export default DifficultyToStarConverter;
