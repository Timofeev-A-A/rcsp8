import React, { useState, useEffect } from "react";
import axios from 'axios';
import './App.css'
// SERVICES

function App() {
  const [products, setProducts] = useState(null);
  const [given, setGiven] = useState(null);
  const [userName, setUserName] = useState('user');
  const [passWord, setPassWord] = useState('userpass');
  const [bVisible, setBVisible] = useState('hidden');
  const [currentUser, setCurrentUser] = useState('guest')
  const user = {
      name: 'user',
      pass: 'userpass'
  };
  const admin = {
      name: 'admin',
      pass: 'adminpass'
  };
  const hasName = (account, name) => name === account.name;
  const hasPass = (account, pass) => pass === account.pass;

    const authCheck = (creator) => {
        if (creator==='guest') {
            alert('Чтобы взаимодействовать с сущностями, авторизуйтесь!');
            return true;
        }
    }
    const getOne = async (name) => {
        const res = await axios.get(`/api/product/${name}`);
        return res.data || [];
    }

    const getAll = async () => {
        let res = await axios.get(`/api/product`);
        return res.data || [];
    }

    const postProduct = async (creator) => {
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
        await getProducts();
        return res.data || [];
    }
    const updateProduct = async (creator) => {
        if (authCheck(creator))
            return;
        let old = prompt('Enter old product name');
        getProduct(old);
        if (creator !== given.creator && creator !== "admin") {
            alert(`У Вас не достаточно прав для редактирования объекта, созданного ${given.creator}`);
            return [];
        }
        let name = prompt('Enter new product name');
        let description = prompt('Enter new product description');
        let res = await axios.put(`/api/product${given.id}`,
            {
                name: name,
                description: description
            }
        );
        await getProducts();
        return res.data || [];
    }
    const deleteProduct = async (creator) => {
        if (authCheck(creator))
            return;
        let old = prompt('Enter product name');
        getProduct(old);
        console.log(given);
        if (creator !== given.creator && creator !== "admin") {
            alert(`У Вас не достаточно прав для удаления объекта, созданного ${given.creator}`);
            return [];
        }
        let res = await axios.delete(`/api/product${given.id}`);
        getProducts();
        return res.data || [];
    }


    useEffect(() => {
        getProducts();
    }, []);

  function handleInputChange(event) {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;
      if (name==="userName")
          setUserName(value);
      else if (name==="passWord")
          setPassWord(value);
  }

  function handleSubmit(event) {
      if (hasName(user, userName) && hasPass(user, passWord)) {
          event.preventDefault();
          setCurrentUser(user.name);
          setBVisible('visible');
          alert('Вы авторизовались как пользователь');
      }
      else if (hasName(admin, userName) && hasPass(admin, passWord)) {
          event.preventDefault();
          setCurrentUser(admin.name);
          setBVisible('visible');
          alert('Вы авторизовались как администратор');
      }
      else alert('Неверное имя пользователя или пароль');
  }


  const getProducts = async () => {
    let res = await getAll();
    console.log(res);
    setProducts(res);
  }

  const getProduct = async (a) => {
      let res = await getOne(a);
      console.log(res);
      setGiven(res);
  }

  const renderProduct = product => {
    return (
        <li key={product._id} className="list__item product">
          <h3 className="product__name">{product.name}</h3>
          <p className="product__description">{product.description}</p>
        </li>
    );
  };

    const bStyle = {visibility: bVisible}
    return (
      <div className="App-header">
          <form onSubmit={handleSubmit}>
              <label>
                  Имя пользователя:
                  <input
                      name="userName"
                      type="text"
                      value={userName}
                      onChange={handleInputChange} />
              </label>
              <br />
              <label>
                  Пароль:
                  <input
                      name="passWord"
                      type="password"
                      value={passWord}
                      onChange={handleInputChange} />
              </label>
              <br />
              <input type="submit" value="Отправить" />
          </form>
        <ul className="list">
          {(products && products.length > 0) ? (
              products.map(product => renderProduct(product))
          ) : (
              <p>No products found</p>
          )}
        </ul>
          <br /><br />
          <div>
              <button className="App-button" style={bStyle} onClick={event => postProduct(currentUser)}>Add</button>
              <button className="App-button" style={bStyle} onClick={event => deleteProduct(currentUser)}>Delete</button>
              <button className="App-button" style={bStyle} onClick={event => updateProduct(currentUser)}>Update</button>
          </div>
      </div>
  );
}

export default App;