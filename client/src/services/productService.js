import axios from 'axios';

const authCheck = (creator) => {
    if (creator==='guest') {
        alert('Чтобы взаимодействовать с сущностьями, авторизуйтесь!');
        return true;
    }
}

const getOne = async (name) => {
    let res = await axios.get(`/api/product/${name}`);
    return res.data || [];
}

export default {

    getAll: async () => {
        let res = await axios.get(`/api/product`);
        return res.data || [];
    },

    postProduct: async (creator) => {
        if (authCheck(creator))
            return;
        let name = prompt('Enter product name');
        let description = prompt('Enter product description');
        let res = await axios.post(`/api/product`,
            {
                name: name,
                description: description,
                creator: creator
            }
            );
        return res.data || [];
    },
    updateProduct: async (creator) => {
        if (authCheck(creator))
            return;
        let old = prompt('Enter old product name');
        let product = getOne(old);
        if (creator !== product.creator && creator !== "admin") {
            alert(`У Вас не достаточно прав для редактирования объекта, созданного ${product.creator}`);
            return [];
        }
        let name = prompt('Enter new product name');
        let description = prompt('Enter new product description');
        let res = await axios.put(`/api/product${product.id}`,
            {
                name: name,
                description: description
            }
            );
        return res.data || [];
    },
    deleteProduct: async (creator) => {
        if (authCheck(creator))
            return;
        let old = prompt('Enter product name');
        let product = getOne(old);
        if (creator !== product.creator && creator !== "admin") {
            alert(`У Вас не достаточно прав для удаления объекта, созданного ${product.creator}`);
            return [];
        }
        let res = await axios.delete(`/api/product${product.id}`);
        return res.data || [];
    }
}