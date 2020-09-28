const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/times', (req, res) => res.send(countHitsuji()))
  // .get('/env', (req, res) => res.send(process.env.TIMES))
  .get('/env', (req, res) => res.send(process.env.NAME))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

  countHitsuji = () => {
    let result = ''
    const times = process.env.TIMES || 5
    for (i = 0; i < times; i++) {
      // result += i + ' '
      result += '羊が' + i + '匹 '
    }
    return result;
  }
