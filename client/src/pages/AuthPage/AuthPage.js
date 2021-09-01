import React, { useState, useContext } from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useHistory
} from "react-router-dom";
import axios from "axios"
import { AuthContext } from '../../context/AuthContext'
import './AuthPage.scss'

export default function AuthPage() {
    const history = useHistory()
    const [form, setForm] = useState({
        email: '',
        password: '',
    })

    const { login } = useContext(AuthContext)

    const changeHandler = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const registerHandler = async () => {
        try {
            await axios.post('/api/auth/registration', { ...form }, {
                headers: { 'Content-Type': 'application/json' }
            })
            history.push('/')
        

        } catch (err) {
            console.log(err)
            
        }
    }

    const loginHandler = async () => {
        try {
            await axios.post('/api/auth/login', { ...form }, {
                headers: { 'Content-Type': 'application/json' }
            }).then(response => {
                login(response.data.token, response.data.userId)
            })

        } catch (err) {

        }
    }

    return (

        <Router>
            <Switch>
                <div className="container">
                    <div className="auth-page">
                        <Route path='/login'>
                            <h3>Авторизация</h3>
                            <form action="" className="form form-login" onSubmit={e => e.preventDefault()}>
                                <div className="row">
                                    <div className="input-field col s12">
                                        <input type="email"
                                            value={form.email}
                                            name="email"
                                            className="validate"
                                            onChange={changeHandler} />
                                        <label htmlFor="email">Email</label>
                                    </div>
                                    <div className="input-field col s12">
                                        <input type="password"
                                            value={form.password}
                                            name="password"
                                            className="validate"
                                            onChange={changeHandler}
                                        />
                                        <label htmlFor="password">Password</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <button
                                        className="waves-effect waves-light btn blue" onClick={loginHandler}>Войти</button>
                                    <Link to="/registration" className="btn-outline btn-reg">Нет акаунта?</Link>
                                </div>
                            </form>
                        </Route>

                        <Route path='/registration'>
                            <h3>Регистрация</h3>
                            <form action="" className="form form-login" onSubmit={e => e.preventDefault()}>
                                <div className="row">
                                    <div className="input-field col s12">
                                        <input type="email"
                                            value={form.email}
                                            name="email"
                                            className="validate"
                                            onChange={changeHandler}
                                        />
                                        <label htmlFor="email">Email</label>
                                    </div>
                                    <div className="input-field col s12">
                                        <input type="password"
                                            value={form.password}
                                            name="password"
                                            className="validate"
                                            onChange={changeHandler}

                                        />
                                        <label htmlFor="password">Password</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <button
                                        className="waves-effect waves-light btn blue"
                                        onClick={registerHandler}>Регистрация
                                    </button>
                                    <Link to="/login" className="btn-outline btn-reg">Уже есть аккаунт?</Link>
                                </div>
                            </form>
                        </Route>
                    </div>
                </div>

            </Switch>
        </Router>
    )
}
