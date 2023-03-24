const config = {
    cluster: {
        username: process.env.CLUSTER_USERNAME,
        password: process.env.CLUSTER_PASSWORD,
        name: 'ChatAppDB',
        db: 'RestaurantApp'
    }
}

export default config;