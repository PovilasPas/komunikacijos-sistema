import { useContext } from "react"
import { AuthContext } from "../../Components/AuthContext"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { enqueueSnackbar } from "notistack"


export const useVerifyOrRefresh = () => {
    const {access, setAccess, refresh, clearAccess, clearRefresh } = useContext(AuthContext)
    const navigate = useNavigate()
    const verifyOrRefresh = async () => {
        const data = {}
        data.token = access
        try {
            await axios.post('users/verify/', data)
            return access
        }
        catch(err) {
            if(err.response?.status === 401){
                delete data.token
                data.refresh = refresh
                try {
                    const res = await axios.post('users/refresh/', data)
                    setAccess(res.data.access)
                    return res.data.access
                }
                catch(err) {
                    if(err.response?.status === 401) {
                        clearAccess()
                        clearRefresh()
                        enqueueSnackbar('Please relogin.', {
                            variant: 'error'
                        })
                        navigate('/Login')
                        return null
                    }
                    else throw err
                }
            }
            else throw err
        }
    }

    return verifyOrRefresh
}