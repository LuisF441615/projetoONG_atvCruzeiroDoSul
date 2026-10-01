import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    base: "/projetoONG_atvCruzeiroDoSul/",
    build: {
        sourcemap: false,
        rollupOptions: {
            input: {
                index: resolve(__dirname, "index.html"),
                projetos: resolve(__dirname, "projetos.html"),
                cadastro: resolve(__dirname, "cadastro.html")
            }
        }
    }
});