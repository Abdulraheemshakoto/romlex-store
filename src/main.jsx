import { render } from "preact";
import Router from "preact-router";
import { useState, useEffect } from "preact/hooks";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { AuthModal } from "./components/AuthModal";
import { Marketplace } from "./pages/Marketplace";
import { ProductDetail } from "./pages/ProductDetail";
import { Orders } from "./pages/Orders";
import { Admin } from "./pages/Admin";
import { initAuth } from "./lib/auth";
import "./index.css";

function App() {
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    initAuth();
  }, []);

  return (
    <div class="min-h-screen bg-bg text-text flex flex-col">
      <Navbar onLoginClick={() => setAuthOpen(true)} />
      <main class="flex-1 pt-[72px]">
        <Router>
          <Marketplace path="/" />
          <ProductDetail
            path="/product/:id"
            onLoginRequired={() => setAuthOpen(true)}
          />
          <Orders path="/orders" />
          <Admin path="/admin" />
        </Router>
      </main>
      <Footer />
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={() => {}}
      />
    </div>
  );
}

render(<App />, document.getElementById("app"));
