var socketUrl;
if (process.env.NODE_ENV == 'development') {
  socketUrl = 'http://localhost:3000';
} else if (process.env.NODE_ENV == 'production') {
  socketUrl = window.location.origin;
}

export default {
    namespaced: true,

    state: {
        url: socketUrl
    }
}