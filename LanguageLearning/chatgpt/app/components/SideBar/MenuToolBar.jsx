import { AppContext } from "@/app/context/AppContext";
import {
  Toolbar,
  Typography,
  Divider,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { useContext } from "react";

export default function MenuToolbar() {
  const { level, setLevel } = useContext(AppContext);
  return (
    <>
      <Toolbar sx={{ display: "flex" }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          قائمة الدورس
        </Typography>
        <FormControl sx={{ m: 1, minWidth: 80 }} size="small">
          <InputLabel id="demo-simple-select-label">Level</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={level}
            defaultValue={"A1"}
            label="Age"
            onChange={(e) => setLevel(e.target.value)}
          >
            <MenuItem value={"A1"}>A1</MenuItem>
            <MenuItem value={"A2"}>A2</MenuItem>
            <MenuItem value={"B1"}>B1</MenuItem>
            <MenuItem value={"B2"}>B2</MenuItem>
            <MenuItem value={"C1"}>C1</MenuItem>
            <MenuItem value={"C2"}>C2</MenuItem>
          </Select>
        </FormControl>
      </Toolbar>
      <Divider />
    </>
  );
}
