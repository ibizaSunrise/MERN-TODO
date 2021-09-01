const { Router } = require('express')
const User = require('../models/User')
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const router = Router()

router.post('/registration',
    [
        check('email', 'Некорректный email').isEmail(),
        check('password', 'Некорректный password').isLength({ min: 6 }),
    ]
    ,
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректныe данные при регистрации'
                })
            }
            const { email, password } = req.body
            const isUsed = await User.findOne({ email })

            if (isUsed) {
                return res.status(300).json({ message: "Данный email занят, попробуйте другой" })
            }
            const hashedPassword = await bcrypt.hash(password, 12)

            const user = new User({ email, password: hashedPassword })
            await user.save()
            res.status(201).json({ message: 'Пользователь создан' })
        } catch (e) {
            console.log(e)
        }
    })

router.post('/login',
    [
        check('email', 'Некорректный email').isEmail(),
        check('password', 'Некорректный password').exists(),
    ]
    ,
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректныe данные при регистрации'
                })
            }
            const { email, password } = req.body

            const user = await User.findOne({ email })

            if (!user) {
                return res.status(400).json({ message: 'Такого Email нет в базе' })
            }

            const isMatch = bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(400).json({ message: 'Пароли не совпадают' })
            }

            const jwtSecret = 'ereerynljnbuifhooafnbsfpah'

            const token = jwt.sign(
                { userId: user.id },
                jwtSecret,
                { expiresIn: '1h' }
            )

            res.json({token, userId: user.id})


        } catch (e) {
            console.log(e)
        }
    })

module.exports = router