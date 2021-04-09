'use strict'

const chai = require('chai')
const expect = chai.expect

const hotels = [
  {
    name: 'Parque das flores',
    score: 3,
    weekday: {
      regular: 110,
      fidelity: 80
    },
    weekend: {
      regular: 90,
      fidelity: 80
    },
  },
  {
    name: 'Jardim Botânico',
    score: 4,
    weekday: {
      regular: 160,
      fidelity: 110
    },
    weekend: {
      regular: 60,
      fidelity: 50
    },
  },
  {
    name: 'Mar Atlântico',
    score: 5,
    weekday: {
      regular: 220,
      fidelity: 100
    },
    weekend: {
      regular: 150,
      fidelity: 40
    },
  }
]

const normalizeHotelSchedules = (typeOfClient, ...dates) => {
  const dayTypeScheduledTimes = dates.reduce((acc, date) => {
    const dayInWeek = new Date(date).getDay()
    const isWeekend = dayInWeek === 0 || dayInWeek === 6

    if (isWeekend) {
      return { ...acc, weekend: acc.weekend + 1 }
    }

    return { ...acc, weekday: acc.weekday + 1 }
  }, { weekday: 0, weekend: 0 })

  const typeOfClients = {
    Regular: 'regular',
    Fidelidade: 'fidelity'
  }

  return {
    type: typeOfClients[typeOfClient],
    ...dayTypeScheduledTimes
  }
}
const getCheaperHotel = (typeOfClient, ...dates) => {
  const formatedInputs = normalizeHotelSchedules(typeOfClient, ...dates)

  return hotels.reduce((acc, hotel) => {
    const weekdayCosts = hotel.weekday[formatedInputs.type] * formatedInputs.weekday
    const weekendCosts = hotel.weekend[formatedInputs.type] * formatedInputs.weekend

    const hotelTotalCosts = weekendCosts + weekdayCosts
    if (!acc.total || hotelTotalCosts < acc.total) return { ...hotel, total: hotelTotalCosts }
    else if (hotelTotalCosts === acc.total) {

      return acc.score > hotel.score ?
        acc : { ...hotel, total: hotelTotalCosts }
    }

    return acc
  }, {}).name
}

describe('A failing test', function () {
  it('should normalize inputs', function () {
    expect(normalizeHotelSchedules('Regular', '16Mar2020(mon)', '17Mar2020(tues)', '18Mar2020(wed)'))
      .to.eql({ type: 'regular', weekday: 3, weekend: 0 })

    expect(normalizeHotelSchedules('Fidelidade', '26Mar2020(thur)', '27Mar2020(fri)', '28Mar2020(sat)'))
      .to.eql({ type: 'fidelity', weekday: 2, weekend: 1 })
  })
  
  it('should get cheaper and the better if there isn not a cheaper one', function () {
    expect(getCheaperHotel('Regular', '16Mar2020(mon)', '17Mar2020(tues)', '18Mar2020(wed)'))
      .to.equal('Parque das flores')

    expect(getCheaperHotel('Regular', '20Mar2020(fri)', '21Mar2020(sat)', '22Mar2020(sun)'))
      .to.equal('Jardim Botânico')

    expect(getCheaperHotel('Fidelidade', '26Mar2020(thur)', '27Mar2020(fri)', '28Mar2020(sat)'))
      .to.equal('Mar Atlântico')
  })
})