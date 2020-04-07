const express = require('express')
const fs = require('fs')
const moment = require('moment')
const R = require('ramda')

const app = express()

const PORT = process.env.PORT || '9876'

app.get('/start', handleRequest('entrada'))
app.get('/end', handleRequest('saida'))

app.listen(PORT)


function handleRequest(field) {
  return function (req, res) {
    const apontamento = addEntry(field)
    writeFile(apontamento)

    res.status(200).end()
  }
}

function addEntry(field) {
  const date = moment().format('DD/MM/YYYY')
  const time = moment().format('HHmm')
  const findCurrentDay = R.find(R.propEq('dia', date))

  const apontamento = JSON.parse(fs.readFileSync('./apontamento.json'))
  const currentDay = findCurrentDay(apontamento)
  if (!currentDay) {
    apontamento.push({
      dia: date,
      [field]: time,
    })
  } else {
    currentDay[field] = time
  }
  return apontamento
}

function writeFile(data) {
  const json = formatJSON(data)

  fs.writeFileSync('./apontamento.json', json)
}

function formatJSON(data) {
  return JSON.stringify(data)
    .replace(/\}(\,)?/g, "\n\t}$1\n")
    .replace(/\[/g, "[\n")
    .replace(/\{/g, "\t{")
    .replace(/\{\"/g, "{\n\t\t\"")
    .replace(/\,\"/g, ",\n\t\t\"")
}