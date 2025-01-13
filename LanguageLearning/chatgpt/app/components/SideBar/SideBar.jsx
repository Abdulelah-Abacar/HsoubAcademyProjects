import { Box, Drawer } from "@mui/material";
import React, { useContext, useState } from "react";
import CustomizedListItem from "./CustomizedListItem";
import MenuToolbar from "./MenuToolBar";
import MenuFooter from "./MenuFooter";
import { AppContext } from "@/app/context/AppContext";

const SideBar = () => {
  const { openMobile, setOpenMobile, drawerWidth } = useContext(AppContext);

  const lectureObject = {
    "Simple-present": "المضارع البسيط",
    "Simple-past": "الماضي البسيط",
    "Descriptive-adjectives-and-adjectives": "الصفات والصفات الموصوفة",
    "Comparative-form": "صيغة المقارنة",
    "plural-nouns": "الأسماء الجمع",
    "Countable-and-uncountable-nouns": "الأسماء المعدودة وغير المعدودة",
    "personal-pronouns": "الضمائر الشخصية",
    Adverbs: "الظروف",
    "Complex-sentences": "الجمل المعقدة",
  };

  const handleDrawerToggle = () => {
    setOpenMobile(!openMobile);
  };
  return (
    <Box
      component="nav"
      sx={{
        width: { sm: drawerWidth },
        flexShrink: { sm: 0 },
      }}
      aria-label="mailbox folders"
    >
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      {/* Mobile */}
      <Drawer
        variant="temporary"
        open={openMobile}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            minHeight: "100%",
          },
        }}
      >
        <MenuToolbar />
        <ul>
          {lectureObject &&
            Object.values(lectureObject).map((item, i) => (
              <CustomizedListItem
                key={i}
                lectureName={item}
                lectureNameEn={Object.keys(lectureObject)[i]}
              />
            ))}
        </ul>
        <MenuFooter />
      </Drawer>

      {/* Desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            minHeight: "100%",
          },
        }}
        open
      >
        <MenuToolbar />
        <ul>
          {lectureObject &&
            Object.values(lectureObject).map((item, i) => (
              <CustomizedListItem
                key={i}
                lectureName={item}
                lectureNameEn={Object.keys(lectureObject)[i]}
              />
            ))}
        </ul>
        <MenuFooter />
      </Drawer>
    </Box>
  );
};

export default SideBar;
