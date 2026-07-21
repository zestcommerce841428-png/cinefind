"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";
import Tooltip from "@mui/material/Tooltip";
import LinearProgress from "@mui/material/LinearProgress";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function ScrollButtons() {
  const [scrolled, setScrolled] = React.useState(0);
  const [visible, setVisible] = React.useState(false);
  const [nearBottom, setNearBottom] = React.useState(false);

  React.useEffect(() => {
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        setScrolled(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
        setVisible(scrollTop > 400);
        setNearBottom(docHeight - scrollTop < 200);
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const scrollToBottom = () =>
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });

  return (
    <>
      {/* Reading progress bar */}
      <LinearProgress
        variant="determinate"
        value={scrolled}
        aria-hidden
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: (t) => t.zIndex.appBar + 1,
          height: 3,
          bgcolor: "transparent",
          "& .MuiLinearProgress-bar": { transition: "none" },
        }}
      />

      <Box
        sx={{
          position: "fixed",
          bottom: { xs: 80, sm: 24 },
          right: { xs: 16, sm: 24 },
          display: "flex",
          flexDirection: "column",
          gap: 1,
          zIndex: (t) => t.zIndex.speedDial,
        }}
      >
        <Zoom in={visible}>
          <Tooltip title="Scroll to top" placement="left">
            <Fab size="small" color="primary" onClick={scrollToTop} aria-label="Scroll to top">
              <KeyboardArrowUpIcon />
            </Fab>
          </Tooltip>
        </Zoom>
        <Zoom in={visible && !nearBottom}>
          <Tooltip title="Scroll to bottom" placement="left">
            <Fab size="small" onClick={scrollToBottom} aria-label="Scroll to bottom">
              <KeyboardArrowDownIcon />
            </Fab>
          </Tooltip>
        </Zoom>
      </Box>
    </>
  );
}
