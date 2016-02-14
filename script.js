'use strict'

//jQuery

//data-* атрибут для хранения дополнительных данных
// наборной атрибут * - может быть все что угодно
/* <p data-price='20'>test</p> */


//data() - доступ к атрибуту data геттер и сеттер. Сеттер не использовать меняет значение только в ДОМ а структура HTML осталась прежней

$(document).ready(function(){
	//ДД по умолчанию навешиваем класы на элементы которые должны быть выделены
	$('#americano').addClass('cheked');
	$('#pizza-size-mid').addClass('cheked');
	$('#garlik').addClass('cheked');
	
	$('#seaIngredients').addClass('activeTypeOfIngredients');
	$('#wraperIngridients').children().addClass('disabledType');
	$('#wraperIngridients').children('#seaIngredientsAll').removeClass('disabledType');
	
	//ДД навешиваем обработчики на изменение типа теста
	$('#dough').children('.pizzaMainConfigRight').children('div').click(function(){
		var thisElem = this;
		
		$('#dough').find('h3').text($(thisElem).data('dough'));
		
		$('#dough').children('.pizzaMainConfigRight').children('div').each(function(){
			if(thisElem===this){
				$(this).addClass('cheked');
			}else{
				$(this).removeClass('cheked');
			}
		})
	});
	//ДД навешиваем обработчики на изменение размера
	$('#size').children('.pizzaMainConfigRight').children('div').click(function(){
		var thisElem = this;
		
		//ДД показываем какой размер
		$('#size').find('h3').text($(thisElem).data('size')+' см');
		
		//ДД меняем отображение картинок размеров
		$('#size').children('.pizzaMainConfigRight').children('div').each(function(){
			if(thisElem===this){
				$(this).addClass('cheked');
			}else{
				$(this).removeClass('cheked');
			}
		});
		
		//ДД перезаполняем стоимость ингридеиентов и вес
		var sizeId = $(this).attr('id');
		if(sizeId === 'pizza-size-large'){
			var dataSize = 'large';
		}else if(sizeId === 'pizza-size-mid'){
			var dataSize = 'mid';
		}else if(sizeId === 'pizza-size-small'){
			var dataSize = 'small';
		}
		
		refillPropertys(dataSize);
			
		//ДД пересчитываем вес и сумму
		getPropertysOfPizza();
		
	});
	
	//ДД каждому размеру пиццы назначаем цену и вес, это правильнее делать тут а не в HTML
	$('#size').children('.pizzaMainConfigRight').children('div').each(function(){
		var sizeId = $(this).attr('id');
		if(sizeId === 'pizza-size-large'){
			var dataPrice = 60;
			var dataWeight = 630;
		}else if(sizeId === 'pizza-size-mid'){
			var dataPrice = 50;
			var dataWeight = 470;
		}else if(sizeId === 'pizza-size-small'){
			var dataPrice = 40;
			var dataWeight = 340;
		}
		
		$(this).attr('data-price', dataPrice);
		$(this).attr('data-weight', dataWeight);

	});
	
	//ДД навешиваем обработчики на изменение соуса
	$('#sauce').children('.pizzaMainConfigRight').children('div').click(function(){
		var thisElem = this;
		
		$('#sauce').find('h3').text($(thisElem).data('sauce'));
		
		$('#sauce').children('.pizzaMainConfigRight').children('div').each(function(){
			if(thisElem===this){
				$(this).addClass('cheked');
			}else{
				$(this).removeClass('cheked');
			}
		})
	});
	
	//ДД навешиваем обработчики на изменение типа начинок
	$('#typesOfIngredients').children().click(function(){
			if(!$(this).hasClass('activeTypeOfIngredients')){
				$('#typesOfIngredients').children().each(function(){
					$(this).removeClass('activeTypeOfIngredients');	
				});	
				$(this).addClass('activeTypeOfIngredients');
				}

				if ($(this).attr('id') === 'seaIngredients') {
					$('#wraperIngridients').children().addClass('disabledType');
					$('#wraperIngridients').children('#seaIngredientsAll').removeClass('disabledType')
				} else if ($(this).attr('id') === 'meatIngredients') {
					$('#wraperIngridients').children().addClass('disabledType');
					$('#wraperIngridients').children('#meatIngredientsAll').removeClass('disabledType')
				} else if ($(this).attr('id') === 'vegIngredients') {
					$('#wraperIngridients').children().addClass('disabledType');
					$('#wraperIngridients').children('#vegIngredientsAll').removeClass('disabledType')
				} else if ($(this).attr('id') === 'cheeseIngredients') {
					$('#wraperIngridients').children().addClass('disabledType');
					$('#wraperIngridients').children('#cheeseIngredientsAll').removeClass('disabledType')
				} else if ($(this).attr('id') === 'refuelIngredients') {
					$('#wraperIngridients').children().addClass('disabledType');
					$('#wraperIngridients').children('#refuelIngredientsAll').removeClass('disabledType')
				}
	});
	

	//ДД получаем массив всех ингридиентов с сервера
	//arrIngridients - это массив ингридиентов где каждый элемент массива объект
	var arrIngridients = getAllIngridientsFromSever();
	//ДД заполняем все ингридиенты
	fillInAllIngridients(arrIngridients);
	
	//ДД проставляем граммы и стоимость каждого ингридиента для средней пиццы которая по умолчанию
	refillPropertys('mid');
	
	//ДД навешиваем обработчик на каждый ингридиент
	$('.oneIngridient').click(function(){
		ingridientOnClick(this);
	});
	
	//ДД навешиваем обработчик сбросить все ингридиенты пиццы
	$('#reset').click(function(){
		$('#selectedIngridients').find('.oneIngridient').each(function(){
			eraseImgOnPizza(this);
			modifyLeftIngridient(this);
		});

		getPropertysOfPizza();
	}); 
	
	//ДД расчитываем сумму и вес всей пиццы
	getPropertysOfPizza();
	
});

//ДД получаем массив всех ингридиентов с сервера(имитация)
function getAllIngridientsFromSever(){
	var arrIngridients = [];
	
	//ДД морские ингридиенты
	var oneIngridient = {
		type:'sea',
		name:'Кальмары',
		img:'images/ingridients/0ed54f93d4fd2757db8f3d819b028db8.jpg',
		imgOnPizza:'images/ingridientsOnPizza/7492f8bf161557c88183eb7fafe6859a.png',
		priceSmall:'10',
		priceMid:'20',
		priceLarge:'30',
		weightSmall:'70',
		weightMid:'80',
		weightLarge:'90',
	};
	arrIngridients.push(oneIngridient);
	
	var oneIngridient = {
		type:'sea',
		name:'Креветка',
		img:'images/ingridients/54c7abb4dd2df47f816b36f40985e9e0.jpg',
		imgOnPizza:'images/ingridientsOnPizza/5eae467115960e4cb6a840e09eabbb04.png',
		priceSmall:'10',
		priceMid:'20',
		priceLarge:'30',
		weightSmall:'70',
		weightMid:'80',
		weightLarge:'90',
	};
	arrIngridients.push(oneIngridient);
	
	var oneIngridient = {
		type:'sea',
		name:'Мидии',
		img:'images/ingridients/91d3e3aea68acb69e40ad5640908ced1.jpg',
		imgOnPizza:'images/ingridientsOnPizza/953773f3d81859dd9d102b2c1d765e8c.png',
		priceSmall:'10',
		priceMid:'20',
		priceLarge:'30',
		weightSmall:'70',
		weightMid:'80',
		weightLarge:'90',
	};
	arrIngridients.push(oneIngridient);
	
	var oneIngridient = {
		type:'sea',
		name:'Сёмга',
		img:'images/ingridients/d35d9e851329196144a68d4d12a59f93.jpg',
		imgOnPizza:'images/ingridientsOnPizza/91febea2a0d2606da1670cb5b8194c29.png',
		priceSmall:'10',
		priceMid:'20',
		priceLarge:'30',
		weightSmall:'70',
		weightMid:'80',
		weightLarge:'90',
	};
	arrIngridients.push(oneIngridient);
	
	var oneIngridient = {
		type:'sea',
		name:'Крабовое мясо',
		img:'images/ingridients/dbfad6420843c9bfb1882d12b0af2c0d.jpg',
		imgOnPizza:'',
		priceSmall:'10',
		priceMid:'20',
		priceLarge:'30',
		weightSmall:'70',
		weightMid:'80',
		weightLarge:'90',
	};
	arrIngridients.push(oneIngridient);
	
	var oneIngridient = {
		type:'sea',
		name:'Тунец',
		img:'images/ingridients/545d93dab68c77f64d824897e99bb718.jpg',
		imgOnPizza:'images/ingridientsOnPizza/c4cea1b7f5fcfe3c4d78deb3439ed2f6.png',
		priceSmall:'10',
		priceMid:'20',
		priceLarge:'30',
		weightSmall:'70',
		weightMid:'80',
		weightLarge:'90',
	};
	arrIngridients.push(oneIngridient);
	//ДД мясные ингридиенты
	var oneIngridient = {
		type:'meat',
		name:'Бекон',
		img:'images/ingridients/ddac6d8417739a2dcaf95ba32f5a8efe.png',
		imgOnPizza:'images/ingridientsOnPizza/13e1bc66309f579198a61c4e48e6cf90.png',
		priceSmall:'10',
		priceMid:'20',
		priceLarge:'30',
		weightSmall:'70',
		weightMid:'80',
		weightLarge:'90',
	};
	arrIngridients.push(oneIngridient);
	
	var oneIngridient = {
		type:'meat',
		name:'Ветчина',
		img:'images/ingridients/39c3580b6ad4ecb63e8dd26830e57c07.jpg',
		imgOnPizza:'images/ingridientsOnPizza/50fe8ec54aa482b699ab989a98e484d5.png',
		priceSmall:'10',
		priceMid:'20',
		priceLarge:'30',
		weightSmall:'70',
		weightMid:'80',
		weightLarge:'90',
	};
	arrIngridients.push(oneIngridient);
	
	var oneIngridient = {
		type:'meat',
		name:'Итальянские колбаски',
		img:'images/ingridients/4b062dffc455e19fd1b3ba63752446ea.png',
		imgOnPizza:'images/ingridientsOnPizza/3e7d9a805e3e97e95a87acde1fd28e64.png',
		priceSmall:'10',
		priceMid:'20',
		priceLarge:'30',
		weightSmall:'70',
		weightMid:'80',
		weightLarge:'90',
	};
	arrIngridients.push(oneIngridient);
	
	var oneIngridient = {
		type:'meat',
		name:'Венские колбаски',
		img:'images/ingridients/de2d8e21946959e30c3dd449543942b5.jpg',
		imgOnPizza:'',
		priceSmall:'10',
		priceMid:'20',
		priceLarge:'30',
		weightSmall:'70',
		weightMid:'80',
		weightLarge:'90',
	};
	arrIngridients.push(oneIngridient);
	
	var oneIngridient = {
		type:'meat',
		name:'Баварские колбаски',
		img:'images/ingridients/d63185a7cb4e03f5db494e663453ecc5.jpg',
		imgOnPizza:'images/ingridientsOnPizza/7492f8bf161557c88183eb7fafe6859a.png',
		priceSmall:'10',
		priceMid:'20',
		priceLarge:'30',
		weightSmall:'70',
		weightMid:'80',
		weightLarge:'90',
	};
	arrIngridients.push(oneIngridient);
	
	var oneIngridient = {
		type:'meat',
		name:'Копченая курица',
		img:'images/ingridients/82e2ed56017b68dc8aa1eda28cb74a0c.png',
		imgOnPizza:'images/ingridientsOnPizza/a3d7461699a6bf9727902206abef9d26.png',
		priceSmall:'10',
		priceMid:'20',
		priceLarge:'30',
		weightSmall:'70',
		weightMid:'80',
		weightLarge:'90',
	};
	arrIngridients.push(oneIngridient);
	
	var oneIngridient = {
		type:'meat',
		name:'Курица гриль',
		img:'images/ingridients/c18695784dd9470d7a249ee547e66156.png',
		imgOnPizza:'images/ingridientsOnPizza/d83951e1f448eb24da03d8682bed99aa.png',
		priceSmall:'10',
		priceMid:'20',
		priceLarge:'30',
		weightSmall:'70',
		weightMid:'80',
		weightLarge:'90',
	};
	arrIngridients.push(oneIngridient);
	
	var oneIngridient = {
		type:'meat',
		name:'Салями Пепперони',
		img:'images/ingridients/4b062dffc455e19fd1b3ba63752446ea.png',
		imgOnPizza:'images/ingridientsOnPizza/97fffd6da2c7545bf30642b0c8eaeaa4.png',
		priceSmall:'10',
		priceMid:'20',
		priceLarge:'30',
		weightSmall:'70',
		weightMid:'80',
		weightLarge:'90',
	};
	arrIngridients.push(oneIngridient);
	
	var oneIngridient = {
		type:'meat',
		name:'Свинина (фарш)',
		img:'images/ingridients/9b6a08bc82ab8bbe8949085a962ea6ce.jpg',
		imgOnPizza:'images/ingridientsOnPizza/58302d87a58b34bbf215193cd468db36.png',
		priceSmall:'10',
		priceMid:'20',
		priceLarge:'30',
		weightSmall:'70',
		weightMid:'80',
		weightLarge:'90',
	};
	arrIngridients.push(oneIngridient);
	
	var oneIngridient = {
		type:'meat',
		name:'Говядина (фарш)',
		img:'images/ingridients/1a71976c94a65dd0b3bb59aa6980ca6c.png',
		imgOnPizza:'images/ingridientsOnPizza/5dbd5bef41b2ecaf43d4537b06481e44.png',
		priceSmall:'10',
		priceMid:'20',
		priceLarge:'30',
		weightSmall:'70',
		weightMid:'80',
		weightLarge:'90',
	};
	arrIngridients.push(oneIngridient);
	
	var oneIngridient = {
		type:'meat',
		name:'Фрикадельки',
		img:'images/ingridients/4b1718a983ee2c3986c67e420054b2af.jpg',
		imgOnPizza:'images/ingridientsOnPizza/d8755b968188016f7461691cd131b309.png',
		priceSmall:'10',
		priceMid:'20',
		priceLarge:'30',
		weightSmall:'70',
		weightMid:'80',
		weightLarge:'90',
	};
	arrIngridients.push(oneIngridient);
	
	var oneIngridient = {
		type:'meat',
		name:'Люля Кебаб',
		img:'images/ingridients/64032511ac6725360fb371d3cb1d6e26.png',
		imgOnPizza:'images/ingridientsOnPizza/2c7bc29d2a184b70a09b0496dfdf169f.png',
		priceSmall:'10',
		priceMid:'20',
		priceLarge:'30',
		weightSmall:'70',
		weightMid:'80',
		weightLarge:'90',
	};
	arrIngridients.push(oneIngridient);
	
	var oneIngridient = {
		type:'meat',
		name:'Куриные Стрипсы',
		img:'images/ingridients/a5b39447ac6c214d8fe04c347005f6c3.png',
		imgOnPizza:'images/ingridientsOnPizza/db9a3ef33e0d5046f17f33ccf0fded7e.png',
		priceSmall:'10',
		priceMid:'20',
		priceLarge:'30',
		weightSmall:'70',
		weightMid:'80',
		weightLarge:'90',
	};
	arrIngridients.push(oneIngridient);
	
	var oneIngridient = {
		type:'veg',
		name:'Кунжутный бортик',
		img:'images/ingridients/862118fa96c8daa4ee90f921b584b85c.jpg',
		imgOnPizza:'images/ingridientsOnPizza/6a4b5884671d7706ae2f491ef559d697.png',
		priceSmall:'10',
		priceMid:'20',
		priceLarge:'30',
		weightSmall:'70',
		weightMid:'80',
		weightLarge:'90',
	};
	arrIngridients.push(oneIngridient);
	
	var oneIngridient = {
		type:'veg',
		name:'Орегано',
		img:'images/ingridients/02d7f7a2a3de549aa8ffec75d63473e5.jpg',
		imgOnPizza:'',
		priceSmall:'10',
		priceMid:'20',
		priceLarge:'30',
		weightSmall:'70',
		weightMid:'80',
		weightLarge:'90',
	};
	arrIngridients.push(oneIngridient);
	
	var oneIngridient = {
		type:'veg',
		name:'Перчик Халапеньо',
		img:'images/ingridients/57234fdb644ca6105cfb8309dc94013d.jpg',
		imgOnPizza:'images/ingridientsOnPizza/78b02540899876aec724752854fab9ab.png',
		priceSmall:'10',
		priceMid:'20',
		priceLarge:'30',
		weightSmall:'70',
		weightMid:'80',
		weightLarge:'90',
	};
	arrIngridients.push(oneIngridient);
	
	var oneIngridient = {
		type:'veg',
		name:'Петрушка',
		img:'images/ingridients/f587bc45ccefee2ff112e83ce2c38c1e.jpg',
		imgOnPizza:'images/ingridientsOnPizza/51518bd2cc71cd590b23ade9aa994130.png',
		priceSmall:'10',
		priceMid:'20',
		priceLarge:'30',
		weightSmall:'70',
		weightMid:'80',
		weightLarge:'90',
	};
	arrIngridients.push(oneIngridient);
	
	var oneIngridient = {
		type:'veg',
		name:'Ананас',
		img:'images/ingridients/db017b8d9a10c3bfc92fe98f9064a9f4.jpg',
		imgOnPizza:'images/ingridientsOnPizza/54ff4e59638d2d9c3f031d51b3b040a6.png',
		priceSmall:'10',
		priceMid:'20',
		priceLarge:'30',
		weightSmall:'70',
		weightMid:'80',
		weightLarge:'90',
	};
	arrIngridients.push(oneIngridient);
	
	
	var oneIngridient = {
		type:'veg',
		name:'Кукуруза',
		img:'images/ingridients/95cc81fea0bb1d69c31f8204557ae4f0.jpg',
		imgOnPizza:'images/ingridientsOnPizza/c1d95f138cbd14ea913db3c7711b13f2.png',
		priceSmall:'10',
		priceMid:'20',
		priceLarge:'30',
		weightSmall:'70',
		weightMid:'80',
		weightLarge:'90',
	};
	arrIngridients.push(oneIngridient);
	
	var oneIngridient = {
		type:'veg',
		name:'Лук',
		img:'images/ingridients/f1a9e6c17faec17ab30e9e148ade64db.jpg',
		imgOnPizza:'images/ingridientsOnPizza/066bb5b36e1e03281e342bb13513e29a.png',
		priceSmall:'10',
		priceMid:'20',
		priceLarge:'30',
		weightSmall:'70',
		weightMid:'80',
		weightLarge:'90',
	};
	arrIngridients.push(oneIngridient);
	
	var oneIngridient = {
		type:'veg',
		name:'Маслины',
		img:'images/ingridients/90051448ac85a3bdd363de32b6b35ce3.jpg',
		imgOnPizza:'images/ingridientsOnPizza/874830532a091ddb297bd5bb3ff6c1df.png',
		priceSmall:'10',
		priceMid:'20',
		priceLarge:'30',
		weightSmall:'70',
		weightMid:'80',
		weightLarge:'90',
	};
	arrIngridients.push(oneIngridient);
	
	var oneIngridient = {
		type:'veg',
		name:'Огурец маринованный',
		img:'images/ingridients/6cf541ba59de05ffd02517949b068a39.jpg',
		imgOnPizza:'images/ingridientsOnPizza/2dc3dd02bbb65a1e7f37e5a3a72f8b10.png',
		priceSmall:'10',
		priceMid:'20',
		priceLarge:'30',
		weightSmall:'70',
		weightMid:'80',
		weightLarge:'90',
	};
	arrIngridients.push(oneIngridient);
	
	var oneIngridient = {
		type:'veg',
		name:'Оливки',
		img:'images/ingridients/e7a6f4634c7c1309364feaa51f121817.jpg',
		imgOnPizza:'images/ingridientsOnPizza/6a6d885bcd03cbd65c147762fc341e8f.png',
		priceSmall:'10',
		priceMid:'20',
		priceLarge:'30',
		weightSmall:'70',
		weightMid:'80',
		weightLarge:'90',
	};
	arrIngridients.push(oneIngridient);
	
	var oneIngridient = {
		type:'veg',
		name:'Перец болгарский',
		img:'images/ingridients/9fd616453ae6ee0ce6372ea734b72a04.jpg',
		imgOnPizza:'images/ingridientsOnPizza/ca1de8f94f2f36e6c7d638068139a47a.png',
		priceSmall:'10',
		priceMid:'20',
		priceLarge:'30',
		weightSmall:'70',
		weightMid:'80',
		weightLarge:'90',
	};
	arrIngridients.push(oneIngridient);
	
	var oneIngridient = {
		type:'veg',
		name:'Помидор',
		img:'images/ingridients/7a53f9826dd097bb678244c8ea155228.jpg',
		imgOnPizza:'images/ingridientsOnPizza/73478e1121e976b26e27976aba158927.png',
		priceSmall:'10',
		priceMid:'20',
		priceLarge:'30',
		weightSmall:'70',
		weightMid:'80',
		weightLarge:'90',
	};
	arrIngridients.push(oneIngridient);
	var oneIngridient = {
		type:'veg',
		name:'Шампиньоны',
		img:'images/ingridients/2c59a2060e209df6a90a33d93255d821.jpg',
		imgOnPizza:'images/ingridientsOnPizza/0f7fc79c9a92b0da4cb6acb332398b9d.png',
		priceSmall:'10',
		priceMid:'20',
		priceLarge:'30',
		weightSmall:'70',
		weightMid:'80',
		weightLarge:'90',
	};
	arrIngridients.push(oneIngridient);
	
	var oneIngridient = {
		type:'veg',
		name:'Опята',
		img:'images/ingridients/e31cda175da5ae0e7734afc62e1acbdf.png',
		imgOnPizza:'images/ingridientsOnPizza/69407041878080ed4fbb5921b2a78b5b.png',
		priceSmall:'10',
		priceMid:'20',
		priceLarge:'30',
		weightSmall:'70',
		weightMid:'80',
		weightLarge:'90',
	};
	arrIngridients.push(oneIngridient);
	
	var oneIngridient = {
		type:'veg',
		name:'Баклажан',
		img:'images/ingridients/067c5d94d50f70d35bd7b442bb32e764.png',
		imgOnPizza:'images/ingridientsOnPizza/48c56a32cf7d567b92d0298cf975c6d2.png',
		priceSmall:'10',
		priceMid:'20',
		priceLarge:'30',
		weightSmall:'70',
		weightMid:'80',
		weightLarge:'90',
	};
	arrIngridients.push(oneIngridient);
	
	var oneIngridient = {
		type:'cheese',
		name:'Дор Блю',
		img:'images/ingridients/cb17fbbfda0b0ea98836bd6bcce381b2.jpg',
		imgOnPizza:'',
		priceSmall:'10',
		priceMid:'20',
		priceLarge:'30',
		weightSmall:'70',
		weightMid:'80',
		weightLarge:'90',
	};
	arrIngridients.push(oneIngridient);
	
	var oneIngridient = {
		type:'cheese',
		name:'Пармезан',
		img:'images/ingridients/882f49abb2b5c08b4cd05fdb3ea7d99a.jpg',
		imgOnPizza:'',
		priceSmall:'10',
		priceMid:'20',
		priceLarge:'30',
		weightSmall:'70',
		weightMid:'80',
		weightLarge:'90',
	};
	arrIngridients.push(oneIngridient);
	
	var oneIngridient = {
		type:'cheese',
		name:'Фета',
		img:'images/ingridients/a2677195bbd3e9380be89db478a54863.jpg',
		imgOnPizza:'',
		priceSmall:'10',
		priceMid:'20',
		priceLarge:'30',
		weightSmall:'70',
		weightMid:'80',
		weightLarge:'90',
	};
	arrIngridients.push(oneIngridient);
	
	var oneIngridient = {
		type:'cheese',
		name:'Филадельфия сыр',
		img:'images/ingridients/b5fc1860f6a99b9009e1da4c888bd347.jpg',
		imgOnPizza:'',
		priceSmall:'10',
		priceMid:'20',
		priceLarge:'30',
		weightSmall:'70',
		weightMid:'80',
		weightLarge:'90',
	};
	arrIngridients.push(oneIngridient);
	
	var oneIngridient = {
		type:'cheese',
		name:'Чеддер',
		img:'images/ingridients/829cc39401693b3e1b88cca190e27a01.jpg',
		imgOnPizza:'',
		priceSmall:'10',
		priceMid:'20',
		priceLarge:'30',
		weightSmall:'70',
		weightMid:'80',
		weightLarge:'90',
	};
	arrIngridients.push(oneIngridient);
	
	var oneIngridient = {
		type:'refuel',
		name:'Остро-сладкий',
		img:'images/ingridients/dab5c5d2e29ecacde8dad21363fa6faf.png',
		imgOnPizza:'images/ingridientsOnPizza/35ba6644fdb0db45c4cd99e80a678f1a.png',
		priceSmall:'10',
		priceMid:'20',
		priceLarge:'30',
		weightSmall:'70',
		weightMid:'80',
		weightLarge:'90',
	};
	arrIngridients.push(oneIngridient);
	
	var oneIngridient = {
		type:'refuel',
		name:'Барбекью',
		img:'images/ingridients/e7cc32f20b8fdf45bea2dfc8867a6053.png',
		imgOnPizza:'images/ingridientsOnPizza/c0b89911aabc62be5ef1f0211e4cde5c.png',
		priceSmall:'10',
		priceMid:'20',
		priceLarge:'30',
		weightSmall:'70',
		weightMid:'80',
		weightLarge:'90',
	};
	arrIngridients.push(oneIngridient);
	
	var oneIngridient = {
		type:'refuel',
		name:'Ранч',
		img:'images/ingridients/99492c99be933ee70b3ea636ed82c1d5.jpg',
		imgOnPizza:'images/ingridientsOnPizza/337af6064069822f564d4fa0822bfad3.png',
		priceSmall:'10',
		priceMid:'20',
		priceLarge:'30',
		weightSmall:'70',
		weightMid:'80',
		weightLarge:'90',
	};
	arrIngridients.push(oneIngridient);
	
	return arrIngridients;
}

//ДД функция заполняет ингридиентами страницу
function fillInAllIngridients(arrIngridients){
	
	for(var i=0;i<arrIngridients.length;i++){
		//по ключу type в обьекте определяем в какой div в структуре HTML добавлять ингридиент 
		var idParent;
		if(arrIngridients[i].type==='sea'){
			idParent = '#seaIngredientsAll'; 
		}else if(arrIngridients[i].type==='meat'){
			idParent = '#meatIngredientsAll';
		}else if(arrIngridients[i].type==='veg'){
			idParent = '#vegIngredientsAll';
		}else if(arrIngridients[i].type==='cheese'){
			idParent = '#cheeseIngredientsAll';
		}else if(arrIngridients[i].type==='refuel'){
			idParent = '#refuelIngredientsAll';
		}
		
		
		$(idParent).append("<div class='oneIngridient'><div class='imgoneIngridient'></div><p>"+arrIngridients[i].name+"</p><div class='weightoneIngridient'><p></p></div><div class='priceoneIngridient'><p></p></div></div>");	
		var newIngridient = $(idParent).children().last();
		$(newIngridient).attr('data-price-small'	, arrIngridients[i].priceSmall);
		$(newIngridient).attr('data-price-mid'		, arrIngridients[i].priceMid);
		$(newIngridient).attr('data-price-large'	, arrIngridients[i].priceLarge);
		$(newIngridient).attr('data-weight-small'	, arrIngridients[i].weightSmall);
		$(newIngridient).attr('data-weight-mid'		, arrIngridients[i].weightMid);
		$(newIngridient).attr('data-weight-large'	, arrIngridients[i].weightLarge);
		$(newIngridient).attr('data-type'			, arrIngridients[i].type);
		$(newIngridient).attr('data-img-pizza'		, arrIngridients[i].imgOnPizza);
		//ДД устанавливаем background-image 
		$(newIngridient).children('.imgoneIngridient').css('background-image','url('+arrIngridients[i].img+')');
	}
	
}

//ДД перезаполняеn стоимость ингридеиентов и вес всех ингридиентов
function refillPropertys(dataSize){
	
	$('.oneIngridient').each(function(){
		$(this).children('.weightoneIngridient').children('p').text($(this).attr('data-weight-'+dataSize)+' гр');
		$(this).children('.priceoneIngridient').children('p').text($(this).attr('data-price-'+dataSize)+' грн');
	});
}
	
	
//ДД расчитываем сумму и вес всей пиццы исходя из размера и выбранных ингридиентов
function getPropertysOfPizza(){
	
	var pizzaPrice = 0;
	var pizzaWeight = 0;
	
	//ДД получаем цену и вес текущего размера
	var chekedElem = $('#size').children('.pizzaMainConfigRight').find('.cheked');
	var sizeId = $(chekedElem).attr('id');
	pizzaPrice += Number($(chekedElem).attr('data-price'));
	pizzaWeight += Number($(chekedElem).attr('data-weight'));
	
	//ДД получаем общую стоимость и вес выбраных ингридиентов
	$('#selectedIngridients').children('.oneIngridient').each(function(){
		
		if(sizeId === 'pizza-size-large'){
			var ingPrice 	= Number($(this).attr('data-price-large'));
			var ingWeight 	= Number($(this).attr('data-weight-large'));
		}else if(sizeId === 'pizza-size-mid'){
			var ingPrice 	= Number($(this).attr('data-price-mid'));
			var ingWeight 	= Number($(this).attr('data-weight-mid'));
		}else if(sizeId === 'pizza-size-small'){
			var ingPrice 	= Number($(this).attr('data-price-small'));
			var ingWeight 	= Number($(this).attr('data-weight-small'));
		}
		//ДД получаем количество порций
		var ingPortions 	= Number($(this).attr('data-portions'));
		
		pizzaPrice += ingPrice*ingPortions;
		pizzaWeight += ingWeight*ingPortions;
	});
	
	
	
	//ДД заполняем расчитанные данные в HTML
	$('#amounts').children('p').text(''+pizzaPrice+' грн / '+pizzaWeight+' гр');
}

//ДД перемещает ингридиент в левую или правую часть в зависимости от того где элемент находится в тек момент
function ingridientOnClick(oneIngridient){
	
	if($(oneIngridient).closest('#allIngredients').length){
		
		$(oneIngridient).fadeOut(1,function(){
			modifyRightIngridient(oneIngridient);
			$('#selectedIngridients').append(oneIngridient);
			//ДД нарисуем изображение добавляемого ингридиента на пицце
			paintImgOnPizza(oneIngridient);
			//ДД пересчитываем сумму и вес всей пиццы
			getPropertysOfPizza();
			$(oneIngridient).fadeIn(400);
		});	
		
	}else{	
		addLeftIngridient(oneIngridient);
		getPropertysOfPizza();
	}

}

//ДД модифицирует ингридиент, удаляет цену и вес и добавляет элементы которые должны отображаться в левой части
function modifyRightIngridient(oneIngridient){
	//ДД убираем лишние элементы
	$(oneIngridient).children('.weightoneIngridient').remove();
	$(oneIngridient).children('.priceoneIngridient').remove();
	
	//ДД указываем что добавлена одна порция ингридиента	
	$(oneIngridient).attr('data-portions',1);
	
	//ДД добавляем новые элементы
	$(oneIngridient).append('<div class="minusQuantity"><div></div></div>');
	$(oneIngridient).append("<div class='amountOfPortions'><div>1</div></div>");
	
	//ДД добавляем стили
	$(oneIngridient).addClass('left');
	$(oneIngridient).children('.amountOfPortions').addClass('none');
	
	//ДД навешиваем обработчик на каждый ингридиент минус
	$(oneIngridient).children('.minusQuantity').click(function(){
		//ДД запрещаем всплытие события что не добавилось количество по клику
		event.stopPropagation();
		var oneIngridient = $(this).closest('.oneIngridient');
		minusQuantityOnClick(oneIngridient);
	});
}

//ДД убирает порцию ингридиента. 
// если порция 1 то переносит ингридиент обратно в правую часть
// если порций 2 и более то отнимает количество порций 
function minusQuantityOnClick(oneIngridient){

	
	//ДД получаем количество порций
	var ingPortions = Number($(oneIngridient).attr('data-portions'));
	if(ingPortions>=2){
		subtractLeftIngridient(oneIngridient);
	}else{
		modifyLeftIngridient(oneIngridient);
	}
		
	//ДД пересчитываем сумму и вес всей пиццы
	getPropertysOfPizza();
}

//ДД функция переносит элемент обратно из левой части в левую
function modifyLeftIngridient(oneIngridient){
	
	$(oneIngridient).fadeOut(1,function(){
		//ДД убираем лишние элементы
		$(oneIngridient).children('.minusQuantity').remove();
		$(oneIngridient).children('.amountOfPortions').remove();
		
		//ДД добавляем стили
		$(oneIngridient).removeClass('left');

		var ingType = $(oneIngridient).attr('data-type');
		var idParent;
		if(ingType==='sea'){
			idParent = '#seaIngredientsAll'; 
		}else if(ingType==='meat'){
			idParent = '#meatIngredientsAll';
		}else if(ingType==='veg'){
			idParent = '#vegIngredientsAll';
		}else if(ingType==='cheese'){
			idParent = '#cheeseIngredientsAll';
		}else if(ingType==='refuel'){
			idParent = '#refuelIngredientsAll';
		}
		
		var sizeId = $('#size').find('.cheked').attr('id');
		if(sizeId === 'pizza-size-large'){
			var dataSize = 'large';
		}else if(sizeId === 'pizza-size-mid'){
			var dataSize = 'mid';
		}else if(sizeId === 'pizza-size-small'){
			var dataSize = 'small';
		}
		
		//ДД добавляем новые элементы
		$(oneIngridient).append("<div class='weightoneIngridient'><p></p></div><div class='priceoneIngridient'><p></p></div>");
		$(oneIngridient).children('.weightoneIngridient').children('p').text($(oneIngridient).attr('data-weight-'+dataSize)+' гр');
		$(oneIngridient).children('.priceoneIngridient').children('p').text($(oneIngridient).attr('data-price-'+dataSize)+' грн');
		
		$(idParent).append(oneIngridient);
		//ДД стираем изображение ингридиента с готовой пиццы
		eraseImgOnPizza(oneIngridient);
		//ДД пересчитываем сумму и вес всей пиццы
		getPropertysOfPizza();
		
		$(oneIngridient).fadeIn(400);
		
	});	
	
}

//ДД функция добавляет 1 порцию ингридиента
function addLeftIngridient(oneIngridient){
	
	var ingPortions = Number($(oneIngridient).attr('data-portions'));
	if(ingPortions===1){
		$(oneIngridient).children('.amountOfPortions').removeClass('none');
	}
	ingPortions+=1;
	
	$(oneIngridient).attr('data-portions',ingPortions);
	$(oneIngridient).children('.amountOfPortions').children('div').text(ingPortions);
}

//ДД функция отнимает 1 порцию ингридиента
function subtractLeftIngridient(oneIngridient){
	
	var ingPortions = Number($(oneIngridient).attr('data-portions'));
	ingPortions-=1;	
	
	$(oneIngridient).attr('data-portions',ingPortions);
	$(oneIngridient).children('.amountOfPortions').children('div').text(ingPortions);
}

//ДД функция рисует ингридиент на готовой пицце
function paintImgOnPizza(oneIngridient){
	//ДД получаем ссылку на картинку для пиццы
	var imgOnPizza = $(oneIngridient).attr('data-img-pizza');
	$('#pizzaView').append('<img src="'+imgOnPizza+'" class="ingridient"></img>');
}

//ДД функция убирает изображение ингридиента на готовой пицце
function eraseImgOnPizza(oneIngridient){
	//ДД получаем ссылку на картинку дляпиццы
	var imgOnPizza = $(oneIngridient).attr('data-img-pizza');
	
	//ДД обходим все картинки и удаляем ту которая имеет src ингридиента
	$('#pizzaView').children('img[src="'+imgOnPizza+'"]').remove();
}
