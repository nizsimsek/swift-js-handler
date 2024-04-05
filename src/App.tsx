import { ThemeProvider } from "@/components/theme-provider";
import LiveRouter from "./routers";
import { ModeToggle } from "./components/mode-toggle";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster />
      <div className="w-full h-screen p-4 flex flex-col gap-2">
        {/* <nav>
          <ul
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <li>
              <a href="/register">Register</a>
            </li>
            <li>
              <a href="/login">Login</a>
            </li>
            <li>
              <a href="/home">Home</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/room/1">Room 1</a>
            </li>
            <li>
              <a href="/room/2">Room 2</a>
            </li>
            <li>
              <a href="/room/3">Room 3</a>
            </li>
            <li>
              <ModeToggle />
            </li>
          </ul>
        </nav> */}
        <LiveRouter />
      </div>
    </ThemeProvider>
  );
}

export default App;
