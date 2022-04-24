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
    const getOne = (name) => {
        axios.get(`/api/product/${name}`)
            .then(function (res) {
                console.log(res);
                setGiven(res.data);
            });
    }

    const getAll = () => {
        axios.get(`/api/product`)
            .then(function (res) {
                console.log(res);
                setProducts(res.data);
            });
    }

    const postProduct = (creator) => {
        if (authCheck(creator))
            return;
        let name = prompt('Enter product name');
        let description = prompt('Enter product description');
        axios.post(`/api/product`,
            {
                name: name,
                description: description,
                creator: creator
            }
        )
            .then(response => {
                return response;
            })
            .then(data => {
                alert(data.data);
                getAll();
            });
    }
    const updateProduct = (creator) => {
        if (authCheck(creator))
            return;
        //let old = prompt('Enter old product name');
        //getOne(old);
        if (creator !== given.creator && creator !== 'admin') {
            alert(`У Вас не достаточно прав для редактирования объекта, созданного ${given.creator}`);
            return [];
        }
        let name = prompt('Enter new product name');
        let description = prompt('Enter new product description');
        axios.put(`/api/product/${given._id}`,
            {
                name: name,
                description: description
            }
        ).then(response => {
            return response;
        })
            .then(data => {
                alert('Запись обновлена');
                getAll();
            });
    }
    const deleteProduct = (creator) => {
        if (authCheck(creator))
            return;
        //let old = prompt('Enter product name');
        //getOne(old);
        console.log(given);
        if (creator !== given.creator && creator !== 'admin') {
            alert(`У Вас не достаточно прав для удаления объекта, созданного ${given.creator}`);
            return [];
        }
        axios.delete(`/api/product/${given._id}`)
            .then(response => {
            return response;
        })
            .then(data => {
                alert('Запись удалена');
                getAll();
            });
    }


    useEffect(() => {
        getAll();
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
          <br />
          <div>
              <span>Выберите продукт для взаимодействия</span>
              <button className="App-button" style={bStyle} onClick={event => getOne(prompt('Enter new product name'))}>Choose</button>
          </div>
          <div>
              <span>Что вы хотите сделать с продуктом?</span>
          </div>
          <div>
              <button className="App-button" style={bStyle} onClick={event => postProduct(currentUser)}>Add</button>
              <button className="App-button" style={bStyle} onClick={event => deleteProduct(currentUser)}>Delete</button>
              <button className="App-button" style={bStyle} onClick={event => updateProduct(currentUser)}>Update</button>
              <button className="App-button" style={bStyle} onClick={event => console.log(given)}>Show</button>
              <button className="App-button" style={bStyle} onClick={event => console.log(currentUser)}>User</button>
          </div>
      </div>
  );
}

export default App;