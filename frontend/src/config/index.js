const config = {
    backEndUrl : import.meta.env.VITE_BACKEND_URL || "",
    googleApiKey : import.meta.env.VITE_GOOGLE_API_KEY || "",
    frontEndUrl : import.meta.env.VITE_FRONTEND_URL || "",
    nodeEnv : import.meta.env.VITE_NODE_ENV || "",
}

export default config