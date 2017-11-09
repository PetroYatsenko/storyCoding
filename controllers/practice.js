const Monster = require('../models/Monster');
var mZoo = {
  title: 'Починаємо вигадувати',
  description: 'Спочатку вибери монстра та героїв своєї історії',
  select_hero_1: 'Вибери свого першого героя.', //TODO: or add yours hero
  select_hero_2: 'Вибери свого другого героя.',
  first_hero: {
    some_boy: {
      id: 'some_boy',
      name: 'Один хлопчик'
    },
    some_girl: {
      id: 'some_girl',
      name: 'Одна дівчинка'
    }
  },
  second_hero: {
    none: {
      id: 'none',
      name: '--- Без героя ---'
    },
    mom: {
      id: 'mommy',
      name: 'Мама'
    },
    dad: {
      id: 'daddy',
      name: 'Тато'
    },
    grandpa: {
      id: 'grandpa',
      name: 'Дідусь'
    },
    granny: {
      id: 'granny',
      name: 'Бабуся'
    }
  },
  monsters_zoo: {
    brechlo: {
      id: 'brechlo',
      name: 'Брехло Нещасне',
      img: 'brechlo',
      talent: 'Живе в Чорному-Пречорному лісі. Стає Брехлом Щасливим, коли чує справді хорошу страшну історію.',          
      enabled: 1
    },
    vovkulaky: {
      id: 'vovkulaky',
      name: 'Вовкулаки',
      img: 'vovkulaky',
      talent: 'Переслідують, поки не прокинешся. І навіть коли прокинешся, все одно біжать за тобою.',          
      enabled: 1
    },
    kovalenko: {
      id: 'kovalenko',
      name: 'Риба-з-Ніжками Коваленко',
      img: 'kovalenko_monster',
      talent: 'Приходить уночі, терпляче чекає на манмурт і летить геть, коли його отримує.',          
      enabled: 1
    },
    transparent_dude: {
      id: 'transparent_dude',
      name: 'Прозорий дядько',
      img: 'transparent_dude',
      talent: 'Каже "Гав!" якщо в кімнаті кілька разів увімкнути й вимкнути світло',          
      enabled: 1
    },
    seredynozher: {
      id: 'seredynozher',
      name: 'Серединожер',
      img: 'seredynozher',
      talent: 'Живе в холодильнику. Пожирає всі продукти зсередини, крім м\'ясного',
      enabled: 1
    },
    elevator: {
      id: 'elevator',
      name: 'Ліфт-монстр',
      img: 'elevator',
      talent: 'Їде вгору навіть коли поверхи скінчилися. Повертається лише коли хтось на першому натисне кнопку.',
      enabled: 1
    },
    pompon_monster: {
      id: 'pompon_monster',
      name: 'Балабоновий монстр',
      img: 'pompon_monster',
      talent: 'Утворюється з чотирьох викинутих балабонів та поглинає весь світ.',
      enabled: 0
    }
  }, 
  monsters_collection: 'Зоопарк монстрів',
  your_talent: 'Ти можеш',      
  your_action: 'Почати свою історію!'
}

exports.getHeroes = (req, res, next) => {
  res.render('13_stories/select_heroes', mZoo);
};

exports.getLoopBuilder = (req, res, next) => {  
  res.render('13_stories/story_builder', {
      title: 'Історія з монстром ' + req.body.mr,
      first_hero_can: 'Що вміє робити Один Хлопчик?',
      second_hero_can: 'Що вміє робити Мама?',
      put_your_text: 'Щоночі Серединожер у холодильнику прокидався і просив \
        ХЛОПЧИКА кинути йому якоїсь поживи: "Знову голодний -- шепотів він. --\
        Тільки не забувай, я не їм м\'ясного!',
      put_your_text_2: 'Серединожер сидить у холодильнику і чекає, що би з\'їсти.'
        + ' Звичайно, він нізащо не буде їсти м\'ясного!'
        + ' У Одного Хлопчика та його Мами є чотири кроки, щоби нагодувати Серединожера.',
      your_action: 'Пишемо далі!',
    }
  ); 
};

