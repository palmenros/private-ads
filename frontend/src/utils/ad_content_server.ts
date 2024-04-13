import axios from 'axios'

const AD_SERVER_URL = 'http://127.0.0.1:5000'

export const uploadAd = async (url, content) => {  
    var bodyFormData = new FormData();
    bodyFormData.append('url', url)
    bodyFormData.append('content', content)
    
    await axios({
        method: 'post',
        url: AD_SERVER_URL + '/ad/post', 
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" }
    })
};

export const downloadAd = async (url) => {
    var bodyFormData = new FormData();
    bodyFormData.append('url', url)
    
    const {data} = await axios({
        method: 'post',
        url: AD_SERVER_URL + '/ad/retrieve', 
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" }
    })
    console.log(data)
    return data
};  