import axios from "@/api/axios";
export class AuthService {
    async loginUser(email, password) {
        try {
            const response = await axios.post("/user/login", { email, password });
            if (response?.data?.success) {
             return response?.data
            }
          } catch (err) {
            throw err
          }
    }
    async createUser(email, password) {
            try {
              const response = await axios.post("/user/register", { email, password });
              if (response?.data?.success) {
                const res = await this.getCurrentUser()
                if(res?.success) {
                  return res
                }
              }
            } catch (err) {
              throw err
            }
    }
    async getCurrentUser(signal) {
            try {
              const response = await axios.get('/user/get-current-user',
                {signal});
              if (response?.data?.success) {
                return response?.data
              }
            } catch (err) {
              throw err
            } 
    }
    async refreshTokens() {
            try {
              const response = await axios.get("/user/refresh-token")
              if(response?.data?.success) {
                  return response?.data
                 }
              } catch (err) {
                  throw err
              }
    }
}

const authService = new AuthService()

export default authService;