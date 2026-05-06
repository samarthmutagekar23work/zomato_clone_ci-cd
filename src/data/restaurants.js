export const RESTAURANTS = [
    {id:'r1',name:'Meghana Foods',cuisines:['Biryani','North Indian'],city:'Bangalore',locality:'Koramangala',rating:4.5,totalRatings:12453,deliveryTime:30,costForTwo:400,isVeg:false,isOpen:true,isPromoted:true,offers:['50% off up to ₹100'],imageKeyword:'biryani',phone:'080-12345678',menu:[
        {id:'m1',name:'Chicken Biryani',price:320,imageKeyword:'biryani',veg:false,rating:4.5},
        {id:'m2',name:'Mutton Biryani',price:420,imageKeyword:'biryani',veg:false,rating:4.7},
        {id:'m3',name:'Chicken 65',price:180,imageKeyword:'chicken-65',veg:false,rating:4.3},
        {id:'m4',name:'Tandoori Chicken',price:280,imageKeyword:'tandoori',veg:false,rating:4.4}
    ]},
    {id:'r2',name:'Truffles',cuisines:['Italian','American'],city:'Bangalore',locality:'Indiranagar',rating:4.2,totalRatings:8921,deliveryTime:25,costForTwo:600,isVeg:false,isOpen:true,isPromoted:true,offers:['20% off'],imageKeyword:'pizza',phone:'080-23456789',menu:[
        {id:'m5',name:'Margherita Pizza',price:280,imageKeyword:'pizza',veg:true,rating:4.4},
        {id:'m6',name:'Classic Burger',price:220,imageKeyword:'burger',veg:false,rating:4.2},
        {id:'m7',name:'Pasta Alfredo',price:250,imageKeyword:'pasta',veg:false,rating:4.3},
        {id:'m8',name:'Chocolate Brownie',price:150,imageKeyword:'cake',veg:true,rating:4.5}
    ]},
    {id:'r3',name:'MTR 1924',cuisines:['South Indian','Breakfast'],city:'Bangalore',locality:'Lalbagh',rating:4.7,totalRatings:15672,deliveryTime:20,costForTwo:300,isVeg:true,isOpen:true,isPromoted:false,offers:[],imageKeyword:'dosa',phone:'080-34567890',menu:[
        {id:'m9',name:'Masala Dosa',price:120,imageKeyword:'dosa',veg:true,rating:4.8},
        {id:'m10',name:'Idli Sambar',price:80,imageKeyword:'idli',veg:true,rating:4.7},
        {id:'m11',name:'Filter Coffee',price:40,imageKeyword:'filter-coffee',veg:true,rating:4.9},
        {id:'m12',name:'Vada',price:60,imageKeyword:'tandoori',veg:true,rating:4.5}
    ]},
    {id:'r4',name:'Vidyarthi Bhavan',cuisines:['South Indian'],city:'Bangalore',locality:'Gandhi Bazaar',rating:4.6,totalRatings:11234,deliveryTime:15,costForTwo:250,isVeg:true,isOpen:true,isPromoted:false,offers:[],imageKeyword:'idli',phone:'080-45678901',menu:[
        {id:'m13',name:'Benne Masala Dosa',price:140,imageKeyword:'dosa',veg:true,rating:4.8},
        {id:'m14',name:'Poori Bhaji',price:100,imageKeyword:'punjabi',veg:true,rating:4.5},
        {id:'m15',name:'Coffee',price:35,imageKeyword:'masala-chai',veg:true,rating:4.6},
        {id:'m16',name:'Rava Idli',price:70,imageKeyword:'idli',veg:true,rating:4.4}
    ]},
    {id:'r5',name:'Empire Restaurant',cuisines:['North Indian','Biryani'],city:'Bangalore',locality:'Koramangala',rating:4.3,totalRatings:9876,deliveryTime:35,costForTwo:500,isVeg:false,isOpen:true,isPromoted:true,offers:['30% off'],imageKeyword:'curry',phone:'080-56789012',menu:[
        {id:'m17',name:'Butter Chicken',price:280,imageKeyword:'butter-chicken',veg:false,rating:4.5},
        {id:'m18',name:'Chicken Biryani',price:240,imageKeyword:'biryani',veg:false,rating:4.4},
        {id:'m19',name:'Paneer Tikka',price:220,imageKeyword:'paneer-tikka',veg:true,rating:4.3},
        {id:'m20',name:'Dal Makhani',price:180,imageKeyword:'dal-makhani',veg:true,rating:4.6}
    ]},
    {id:'r6',name:'Koshy\'s',cuisines:['Continental','Bakery'],city:'Bangalore',locality:'St. Marks Road',rating:4.4,totalRatings:7654,deliveryTime:30,costForTwo:450,isVeg:false,isOpen:true,isPromoted:false,offers:[],imageKeyword:'bakery',phone:'080-67890123',menu:[
        {id:'m21',name:'Fish and Chips',price:320,imageKeyword:'fish-curry',veg:false,rating:4.3},
        {id:'m22',name:'Chocolate Cake',price:180,imageKeyword:'cake',veg:true,rating:4.6},
        {id:'m23',name:'Club Sandwich',price:220,imageKeyword:'burger',veg:false,rating:4.2},
        {id:'m24',name:'Cold Coffee',price:120,imageKeyword:'cold-coffee',veg:true,rating:4.5}
    ]},
    {id:'r7',name:'The Fatty Bao',cuisines:['Asian','Japanese'],city:'Bangalore',locality:'Indiranagar',rating:4.5,totalRatings:5432,deliveryTime:40,costForTwo:1200,isVeg:false,isOpen:true,isPromoted:true,offers:['15% off'],imageKeyword:'sushi',phone:'080-78901234',menu:[
        {id:'m25',name:'Sushi Platter',price:680,imageKeyword:'tandoori',veg:false,rating:4.7},
        {id:'m26',name:'Ramen Noodles',price:380,imageKeyword:'noodles',veg:false,rating:4.5},
        {id:'m27',name:'Spring Rolls',price:250,imageKeyword:'noodles',veg:true,rating:4.4},
        {id:'m28',name:'Green Tea Mochi',price:180,imageKeyword:'kulfi',veg:true,rating:4.6}
    ]},
    {id:'r8',name:'Social Koramangala',cuisines:['Continental','American'],city:'Bangalore',locality:'Koramangala',rating:4.1,totalRatings:6543,deliveryTime:30,costForTwo:800,isVeg:false,isOpen:true,isPromoted:false,offers:['Happy Hours'],imageKeyword:'burger',phone:'080-89012345',menu:[
        {id:'m29',name:'BBQ Ribs',price:480,imageKeyword:'barbeque',veg:false,rating:4.3},
        {id:'m30',name:'Loaded Nachos',price:280,imageKeyword:'pizza',veg:false,rating:4.2},
        {id:'m31',name:'Chicken Wings',price:320,imageKeyword:'tandoori',veg:false,rating:4.4},
        {id:'m32',name:'Mojito',price:220,imageKeyword:'lemon-mint-mojito',veg:true,rating:4.5}
    ]},
    {id:'r9',name:'Nandhana Palace',cuisines:['Andhra','Biryani'],city:'Bangalore',locality:'BTM Layout',rating:4.3,totalRatings:8765,deliveryTime:35,costForTwo:450,isVeg:false,isOpen:true,isPromoted:false,offers:['40% off'],imageKeyword:'biryani',phone:'080-90123456',menu:[
        {id:'m33',name:'Andhra Chicken Biryani',price:350,imageKeyword:'biryani',veg:false,rating:4.6},
        {id:'m34',name:'Apollo Fish',price:280,imageKeyword:'fish-curry',veg:false,rating:4.4},
        {id:'m35',name:'Gongura Mutton',price:420,imageKeyword:'chicken-curry',veg:false,rating:4.5},
        {id:'m36',name:'Pesarattu',price:150,imageKeyword:'dosa',veg:true,rating:4.3}
    ]},
    {id:'r10',name:'Brahmin\'s Coffee Bar',cuisines:['South Indian','Coffee'],city:'Bangalore',locality:'Basavanagudi',rating:4.8,totalRatings:13456,deliveryTime:15,costForTwo:200,isVeg:true,isOpen:true,isPromoted:false,offers:[],imageKeyword:'coffee',phone:'080-01234567',menu:[
        {id:'m37',name:'Set Dosa',price:60,imageKeyword:'dosa',veg:true,rating:4.8},
        {id:'m38',name:'Idli Vada',price:50,imageKeyword:'idli',veg:true,rating:4.7},
        {id:'m39',name:'Filter Coffee',price:30,imageKeyword:'filter-coffee',veg:true,rating:4.9},
        {id:'m40',name:'Chow Chow Bath',price:80,imageKeyword:'tandoori',veg:true,rating:4.6}
    ]},
    {id:'r11',name:'Udupi Palace',cuisines:['South Indian','Vegetarian'],city:'Bangalore',locality:'Jayanagar',rating:4.4,totalRatings:7654,deliveryTime:20,costForTwo:280,isVeg:true,isOpen:true,isPromoted:false,offers:['Free delivery'],imageKeyword:'thali',phone:'080-11223344',menu:[
        {id:'m41',name:'South Indian Thali',price:180,imageKeyword:'thali',veg:true,rating:4.5},
        {id:'m42',name:'Mysore Masala Dosa',price:130,imageKeyword:'dosa',veg:true,rating:4.6},
        {id:'m43',name:'Uttapam',price:100,imageKeyword:'tandoori',veg:true,rating:4.4},
        {id:'m44',name:'Payasam',price:60,imageKeyword:'rasmalai',veg:true,rating:4.5}
    ]},
    {id:'r12',name:'Barbeque Nation',cuisines:['North Indian','BBQ'],city:'Bangalore',locality:'Indiranagar',rating:4.2,totalRatings:9876,deliveryTime:45,costForTwo:1200,isVeg:false,isOpen:true,isPromoted:true,offers:['10% off'],imageKeyword:'barbeque',phone:'080-22334455',menu:[
        {id:'m45',name:'BBQ Chicken Platter',price:480,imageKeyword:'barbeque',veg:false,rating:4.5},
        {id:'m46',name:'Lamb Chops',price:580,imageKeyword:'tandoori',veg:false,rating:4.4},
        {id:'m47',name:'Paneer Tikka',price:320,imageKeyword:'paneer-tikka',veg:true,rating:4.3},
        {id:'m48',name:'Butter Naan',price:50,imageKeyword:'butter-naan',veg:true,rating:4.6}
    ]},
    {id:'r13',name:'Toit Brewpub',cuisines:['Continental','Beer'],city:'Bangalore',locality:'Indiranagar',rating:4.6,totalRatings:7654,deliveryTime:40,costForTwo:1000,isVeg:false,isOpen:true,isPromoted:false,offers:[],imageKeyword:'beer',phone:'080-33445566',menu:[
        {id:'m49',name:'Craft Beer Pint',price:350,imageKeyword:'lemon-mint-mojito',veg:true,rating:4.7},
        {id:'m50',name:'Grilled Salmon',price:580,imageKeyword:'fish-curry',veg:false,rating:4.5},
        {id:'m51',name:'Chicken Steak',price:420,imageKeyword:'chicken-curry',veg:false,rating:4.4},
        {id:'m52',name:'Bruschetta',price:250,imageKeyword:'pizza',veg:true,rating:4.3}
    ]},
    {id:'r14',name:'The Humming Tree',cuisines:['Continental','Cafe'],city:'Bangalore',locality:'Indiranagar',rating:4.3,totalRatings:5432,deliveryTime:35,costForTwo:700,isVeg:false,isOpen:true,isPromoted:false,offers:[],imageKeyword:'pasta',phone:'080-44556677',menu:[
        {id:'m53',name:'Penne Arrabiata',price:280,imageKeyword:'pasta',veg:true,rating:4.4},
        {id:'m54',name:'Chicken Caesar Salad',price:250,imageKeyword:'tandoori',veg:false,rating:4.3},
        {id:'m55',name:'Mushroom Risotto',price:320,imageKeyword:'thali',veg:true,rating:4.5},
        {id:'m56',name:'Cheesecake',price:200,imageKeyword:'cake',veg:true,rating:4.6}
    ]},
    {id:'r15',name:'Hole in the Wall Cafe',cuisines:['Continental','Cafe'],city:'Bangalore',locality:'Koramangala',rating:4.5,totalRatings:6543,deliveryTime:30,costForTwo:500,isVeg:false,isOpen:true,isPromoted:false,offers:['20% off'],imageKeyword:'cafe',phone:'080-55667788',menu:[
        {id:'m57',name:'All Day Breakfast',price:320,imageKeyword:'idli',veg:false,rating:4.5},
        {id:'m58',name:'Avocado Toast',price:250,imageKeyword:'thali',veg:true,rating:4.4},
        {id:'m59',name:'Flat White Coffee',price:150,imageKeyword:'filter-coffee',veg:true,rating:4.7},
        {id:'m60',name:'Acai Bowl',price:280,imageKeyword:'rasmalai',veg:true,rating:4.3}
    ]},
    {id:'r16',name:'Punjabi Rasoi',cuisines:['North Indian','Punjabi'],city:'Bangalore',locality:'Marathahalli',rating:4.1,totalRatings:4321,deliveryTime:35,costForTwo:350,isVeg:false,isOpen:true,isPromoted:false,offers:['50% off'],imageKeyword:'punjabi',phone:'080-66778899',menu:[
        {id:'m61',name:'Butter Chicken',price:250,imageKeyword:'butter-chicken',veg:false,rating:4.4},
        {id:'m62',name:'Dal Makhani',price:180,imageKeyword:'dal-makhani',veg:true,rating:4.6},
        {id:'m63',name:'Tandoori Roti',price:35,imageKeyword:'tandoori-roti',veg:true,rating:4.3},
        {id:'m64',name:'Lassi',price:80,imageKeyword:'lassi',veg:true,rating:4.5}
    ]},
    {id:'r17',name:'Chutney Chang',cuisines:['Chinese','Thai'],city:'Bangalore',locality:'Koramangala',rating:4.2,totalRatings:5432,deliveryTime:35,costForTwo:600,isVeg:false,isOpen:true,isPromoted:false,offers:['30% off'],imageKeyword:'noodles',phone:'080-77889900',menu:[
        {id:'m65',name:'Pad Thai',price:280,imageKeyword:'noodles',veg:false,rating:4.4},
        {id:'m66',name:'Dim Sum Platter',price:320,imageKeyword:'veg-manchurian',veg:false,rating:4.3},
        {id:'m67',name:'Thai Green Curry',price:350,imageKeyword:'chicken-curry',veg:false,rating:4.5},
        {id:'m68',name:'Spring Rolls',price:180,imageKeyword:'noodles',veg:true,rating:4.2}
    ]},
    {id:'r18',name:'Byg Brewski',cuisines:['Continental','Brewery'],city:'Bangalore',locality:'HSR Layout',rating:4.4,totalRatings:7654,deliveryTime:40,costForTwo:1100,isVeg:false,isOpen:true,isPromoted:true,offers:[],imageKeyword:'brewery',phone:'080-88990011',menu:[
        {id:'m69',name:'Wheat Beer',price:350,imageKeyword:'lemon-mint-mojito',veg:true,rating:4.6},
        {id:'m70',name:'Woodfire Pizza',price:380,imageKeyword:'pizza',veg:false,rating:4.5},
        {id:'m71',name:'Grilled Lamb',price:580,imageKeyword:'tandoori',veg:false,rating:4.4},
        {id:'m72',name:'Nachos Supreme',price:280,imageKeyword:'pizza',veg:true,rating:4.3}
    ]},
    {id:'r19',name:'Glen\'s Bakehouse',cuisines:['Bakery','Continental'],city:'Bangalore',locality:'Lavelle Road',rating:4.3,totalRatings:6543,deliveryTime:25,costForTwo:400,isVeg:false,isOpen:true,isPromoted:false,offers:['Buy 2 Get 1'],imageKeyword:'cake',phone:'080-99001122',menu:[
        {id:'m73',name:'Chocolate Truffle Cake',price:450,imageKeyword:'cake',veg:true,rating:4.7},
        {id:'m74',name:'Croissant',price:120,imageKeyword:'bakery',veg:true,rating:4.5},
        {id:'m75',name:'Chicken Quiche',price:250,imageKeyword:'pizza',veg:false,rating:4.4},
        {id:'m76',name:'Iced Latte',price:180,imageKeyword:'cold-coffee',veg:true,rating:4.6}
    ]},
    {id:'r20',name:'Nasi and Mee',cuisines:['Chinese','Thai'],city:'Bangalore',locality:'Indiranagar',rating:4.2,totalRatings:4321,deliveryTime:35,costForTwo:650,isVeg:false,isOpen:true,isPromoted:false,offers:[],imageKeyword:'noodles',phone:'080-00112233',menu:[
        {id:'m77',name:'Nasi Goreng',price:280,imageKeyword:'chicken-fried-rice',veg:false,rating:4.4},
        {id:'m78',name:'Mee Goreng',price:250,imageKeyword:'noodles',veg:false,rating:4.3},
        {id:'m79',name:'Satay Platter',price:320,imageKeyword:'tandoori',veg:false,rating:4.5},
        {id:'m80',name:'Tom Yum Soup',price:200,imageKeyword:'fish-curry',veg:false,rating:4.6}
    ]},
    {id:'r21',name:'Bastian',cuisines:['Seafood','Continental'],city:'Mumbai',locality:'Bandra West',rating:4.6,totalRatings:8765,deliveryTime:40,costForTwo:1500,isVeg:false,isOpen:true,isPromoted:true,offers:[],imageKeyword:'seafood',phone:'022-12345678',menu:[
        {id:'m81',name:'Butter Garlic Prawns',price:580,imageKeyword:'prawn-curry',veg:false,rating:4.7},
        {id:'m82',name:'Fish Fingers',price:420,imageKeyword:'fish-curry',veg:false,rating:4.5},
        {id:'m83',name:'Crab Xec Xec',price:680,imageKeyword:'fish-curry',veg:false,rating:4.6},
        {id:'m84',name:'Calamari Rings',price:380,imageKeyword:'veg-manchurian',veg:false,rating:4.4}
    ]},
    {id:'r22',name:'The Bombay Canteen',cuisines:['Modern Indian','Cocktails'],city:'Mumbai',locality:'Lower Parel',rating:4.7,totalRatings:9876,deliveryTime:45,costForTwo:1400,isVeg:false,isOpen:true,isPromoted:true,offers:['20% off'],imageKeyword:'modern-indian',phone:'022-23456789',menu:[
        {id:'m85',name:'Deconstructed Biryani',price:480,imageKeyword:'biryani',veg:false,rating:4.8},
        {id:'m86',name:'Paneer Lababdar',price:320,imageKeyword:'paneer-tikka',veg:true,rating:4.5},
        {id:'m87',name:'Smoked Chicken Tikka',price:420,imageKeyword:'tandoori',veg:false,rating:4.7},
        {id:'m88',name:'Gulab Jamun Cheesecake',price:280,imageKeyword:'gulab-jamun',veg:true,rating:4.9}
    ]},
    {id:'r23',name:'Trishna',cuisines:['Seafood','Coastal'],city:'Mumbai',locality:'Kala Ghoda',rating:4.5,totalRatings:7654,deliveryTime:35,costForTwo:1200,isVeg:false,isOpen:true,isPromoted:false,offers:[],imageKeyword:'crab',phone:'022-34567890',menu:[
        {id:'m89',name:'Butter Garlic Crab',price:780,imageKeyword:'fish-curry',veg:false,rating:4.8},
        {id:'m90',name:'Pomfret Tawa Fry',price:620,imageKeyword:'fish-curry',veg:false,rating:4.6},
        {id:'m91',name:'Prawn Coconut Curry',price:480,imageKeyword:'prawn-curry',veg:false,rating:4.5},
        {id:'m92',name:'Fish Koliwada',price:380,imageKeyword:'fish-curry',veg:false,rating:4.7}
    ]},
    {id:'r24',name:'Britannia & Co.',cuisines:['Parsi','Indian'],city:'Mumbai',locality:'Ballard Estate',rating:4.8,totalRatings:6543,deliveryTime:30,costForTwo:500,isVeg:false,isOpen:true,isPromoted:false,offers:[],imageKeyword:'parsi',phone:'022-45678901',menu:[
        {id:'m93',name:'Berry Pulao',price:280,imageKeyword:'biryani',veg:false,rating:4.7},
        {id:'m94',name:'Sali Boti',price:350,imageKeyword:'chicken-curry',veg:false,rating:4.6},
        {id:'m95',name:'Dhansak',price:320,imageKeyword:'dal-makhani',veg:false,rating:4.5},
        {id:'m96',name:'Caramel Custard',price:150,imageKeyword:'rasmalai',veg:true,rating:4.8}
    ]},
    {id:'r25',name:'Cafe Mondegar',cuisines:['Cafe','Continental'],city:'Mumbai',locality:'Colaba',rating:4.3,totalRatings:5432,deliveryTime:25,costForTwo:600,isVeg:false,isOpen:true,isPromoted:false,offers:['Happy Hours'],imageKeyword:'cafe',phone:'022-56789012',menu:[
        {id:'m97',name:'Mexican Platter',price:380,imageKeyword:'pizza',veg:false,rating:4.4},
        {id:'m98',name:'Fish and Chips',price:320,imageKeyword:'fish-curry',veg:false,rating:4.3},
        {id:'m99',name:'Club Sandwich',price:250,imageKeyword:'burger',veg:false,rating:4.2},
        {id:'m100',name:'Cold Coffee',price:150,imageKeyword:'cold-coffee',veg:true,rating:4.5}
    ]},
    {id:'r26',name:'Leopold Cafe',cuisines:['Continental','Chinese'],city:'Mumbai',locality:'Colaba',rating:4.2,totalRatings:7654,deliveryTime:30,costForTwo:700,isVeg:false,isOpen:true,isPromoted:false,offers:[],imageKeyword:'continental',phone:'022-67890123',menu:[
        {id:'m101',name:'Chicken Tikka Pizza',price:380,imageKeyword:'pizza',veg:false,rating:4.4},
        {id:'m102',name:'Hakka Noodles',price:250,imageKeyword:'noodles',veg:false,rating:4.3},
        {id:'m103',name:'Chicken Satay',price:320,imageKeyword:'tandoori',veg:false,rating:4.5},
        {id:'m104',name:'Tiramisu',price:280,imageKeyword:'cake',veg:true,rating:4.6}
    ]},
    {id:'r27',name:'Bademiya',cuisines:['Mughlai','Kebabs'],city:'Mumbai',locality:'Colaba',rating:4.4,totalRatings:11234,deliveryTime:20,costForTwo:400,isVeg:false,isOpen:true,isPromoted:true,offers:['10% off'],imageKeyword:'kebab',phone:'022-78901234',menu:[
        {id:'m105',name:'Seekh Kebab',price:280,imageKeyword:'tandoori',veg:false,rating:4.6},
        {id:'m106',name:'Chicken Tikka Roll',price:220,imageKeyword:'tandoori',veg:false,rating:4.5},
        {id:'m107',name:'Mutton Kebab',price:350,imageKeyword:'tandoori',veg:false,rating:4.7},
        {id:'m108',name:'Sheermal',price:60,imageKeyword:'naan',veg:true,rating:4.4}
    ]},
    {id:'r28',name:'Masala Library',cuisines:['Molecular','Modern Indian'],city:'Mumbai',locality:'Bandra Kurla Complex',rating:4.6,totalRatings:4321,deliveryTime:50,costForTwo:2000,isVeg:false,isOpen:true,isPromoted:true,offers:[],imageKeyword:'molecular',phone:'022-89012345',menu:[
        {id:'m109',name:'Deconstructed Dal',price:420,imageKeyword:'dal-makhani',veg:true,rating:4.7},
        {id:'m110',name:'Spherical Rasmalai',price:380,imageKeyword:'rasmalai',veg:true,rating:4.8},
        {id:'m111',name:'Smoked Butter Chicken',price:520,imageKeyword:'butter-chicken',veg:false,rating:4.6},
        {id:'m112',name:'Nitrogen Ice Cream',price:250,imageKeyword:'kulfi',veg:true,rating:4.9}
    ]},
    {id:'r29',name:'Pali Village Cafe',cuisines:['Italian','Cafe'],city:'Mumbai',locality:'Bandra West',rating:4.1,totalRatings:5432,deliveryTime:35,costForTwo:800,isVeg:false,isOpen:true,isPromoted:false,offers:['15% off'],imageKeyword:'italian',phone:'022-90123456',menu:[
        {id:'m113',name:'Margherita Pizza',price:280,imageKeyword:'pizza',veg:true,rating:4.3},
        {id:'m114',name:'Penne Arrabiata',price:320,imageKeyword:'pasta',veg:true,rating:4.4},
        {id:'m115',name:'Caesar Salad',price:250,imageKeyword:'tandoori',veg:true,rating:4.2},
        {id:'m116',name:'Cappuccino',price:180,imageKeyword:'masala-chai',veg:true,rating:4.5}
    ]},
    {id:'r30',name:'The Table',cuisines:['European','Seafood'],city:'Mumbai',locality:'Colaba',rating:4.5,totalRatings:6543,deliveryTime:40,costForTwo:1600,isVeg:false,isOpen:true,isPromoted:false,offers:[],imageKeyword:'seafood',phone:'022-01234567',menu:[
        {id:'m117',name:'Grilled Lobster',price:880,imageKeyword:'prawn-curry',veg:false,rating:4.7},
        {id:'m118',name:'Steak Frites',price:680,imageKeyword:'chicken-curry',veg:false,rating:4.6},
        {id:'m119',name:'Oysters Rockefeller',price:580,imageKeyword:'fish-curry',veg:false,rating:4.5},
        {id:'m120',name:'Tiramisu',price:320,imageKeyword:'cake',veg:true,rating:4.8}
    ]},
    {id:'r31',name:'Karim\'s',cuisines:['Mughlai','Kebabs'],city:'Delhi',locality:'Jama Masjid',rating:4.7,totalRatings:15672,deliveryTime:25,costForTwo:500,isVeg:false,isOpen:true,isPromoted:true,offers:['30% off'],imageKeyword:'mughlai',phone:'011-12345678',menu:[
        {id:'m121',name:'Mutton Keema',price:320,imageKeyword:'chicken-curry',veg:false,rating:4.8},
        {id:'m122',name:'Chicken Jahangiri',price:380,imageKeyword:'tandoori',veg:false,rating:4.7},
        {id:'m123',name:'Nahari',price:420,imageKeyword:'chicken-curry',veg:false,rating:4.6},
        {id:'m124',name:'Roomali Roti',price:50,imageKeyword:'naan',veg:true,rating:4.5}
    ]},
    {id:'r32',name:'Indian Accent',cuisines:['Modern Indian','Fusion'],city:'Delhi',locality:'Lodhi Road',rating:4.8,totalRatings:7654,deliveryTime:50,costForTwo:2500,isVeg:false,isOpen:true,isPromoted:true,offers:[],imageKeyword:'fusion',phone:'011-23456789',menu:[
        {id:'m125',name:'Blue Cheese Naan',price:480,imageKeyword:'butter-naan',veg:true,rating:4.9},
        {id:'m126',name:'Ghee Roast Prawn',price:680,imageKeyword:'prawn-curry',veg:false,rating:4.8},
        {id:'m127',name:'Sous Vide Chicken',price:580,imageKeyword:'chicken-curry',veg:false,rating:4.7},
        {id:'m128',name:'Chocolate Fondant',price:380,imageKeyword:'cake',veg:true,rating:4.8}
    ]},
    {id:'r33',name:'Sita Ram Diwan Chand',cuisines:['North Indian','Chole Bhature'],city:'Delhi',locality:'Paharganj',rating:4.6,totalRatings:11234,deliveryTime:15,costForTwo:200,isVeg:true,isOpen:true,isPromoted:false,offers:[],imageKeyword:'chole-bhature',phone:'011-34567890',menu:[
        {id:'m129',name:'Chole Bhature',price:120,imageKeyword:'thali',veg:true,rating:4.8},
        {id:'m130',name:'Lassi',price:60,imageKeyword:'lassi',veg:true,rating:4.7},
        {id:'m131',name:'Aloo Paratha',price:80,imageKeyword:'punjabi',veg:true,rating:4.6},
        {id:'m132',name:'Pickle',price:20,imageKeyword:'thali',veg:true,rating:4.5}
    ]},
    {id:'r34',name:'Paranthe Wali Gali',cuisines:['North Indian','Paratha'],city:'Delhi',locality:'Chandni Chowk',rating:4.5,totalRatings:9876,deliveryTime:20,costForTwo:250,isVeg:true,isOpen:true,isPromoted:false,offers:['Buy 2 Get 1'],imageKeyword:'paratha',phone:'011-45678901',menu:[
        {id:'m133',name:'Mixed Paratha Platter',price:180,imageKeyword:'punjabi',veg:true,rating:4.6},
        {id:'m134',name:'Kachori',price:60,imageKeyword:'tandoori',veg:true,rating:4.5},
        {id:'m135',name:'Halwa',price:50,imageKeyword:'gajar-halwa',veg:true,rating:4.4},
        {id:'m136',name:'Lassi',price:50,imageKeyword:'lassi',veg:true,rating:4.7}
    ]},
    {id:'r35',name:'Bukhara',cuisines:['North Indian','BBQ'],city:'Delhi',locality:'Diplomatic Enclave',rating:4.9,totalRatings:6543,deliveryTime:45,costForTwo:3000,isVeg:false,isOpen:true,isPromoted:true,offers:[],imageKeyword:'dal-bukhara',phone:'011-56789012',menu:[
        {id:'m137',name:'Dal Bukhara',price:380,imageKeyword:'dal-makhani',veg:true,rating:4.9},
        {id:'m138',name:'Sikandari Raan',price:780,imageKeyword:'tandoori',veg:false,rating:4.8},
        {id:'m139',name:'Tandoori Pomfret',price:680,imageKeyword:'fish-curry',veg:false,rating:4.7},
        {id:'m140',name:'Sheermal',price:80,imageKeyword:'naan',veg:true,rating:4.6}
    ]},
    {id:'r36',name:'Saravana Bhavan',cuisines:['South Indian','Vegetarian'],city:'Delhi',locality:'Connaught Place',rating:4.4,totalRatings:8765,deliveryTime:20,costForTwo:300,isVeg:true,isOpen:true,isPromoted:false,offers:['Free delivery'],imageKeyword:'south-indian',phone:'011-67890123',menu:[
        {id:'m141',name:'Masala Dosa',price:120,imageKeyword:'dosa',veg:true,rating:4.5},
        {id:'m142',name:'Thali',price:220,imageKeyword:'thali',veg:true,rating:4.6},
        {id:'m143',name:'Idli',price:60,imageKeyword:'idli',veg:true,rating:4.4},
        {id:'m144',name:'Filter Coffee',price:40,imageKeyword:'filter-coffee',veg:true,rating:4.7}
    ]},
    {id:'r37',name:'The Big Chill',cuisines:['Italian','Desserts'],city:'Delhi',locality:'East of Kailash',rating:4.3,totalRatings:7654,deliveryTime:30,costForTwo:700,isVeg:false,isOpen:true,isPromoted:false,offers:['20% off'],imageKeyword:'pasta',phone:'011-78901234',menu:[
        {id:'m145',name:'Penne Alfredo',price:320,imageKeyword:'pasta',veg:false,rating:4.5},
        {id:'m146',name:'Woodfire Pizza',price:380,imageKeyword:'pizza',veg:false,rating:4.4},
        {id:'m147',name:'Brownie Sundae',price:250,imageKeyword:'cake',veg:true,rating:4.7},
        {id:'m148',name:'Lemon Cheesecake',price:280,imageKeyword:'cake',veg:true,rating:4.6}
    ]},
    {id:'r38',name:'Chaat Street',cuisines:['Street Food','Chaat'],city:'Delhi',locality:'Chandni Chowk',rating:4.2,totalRatings:5432,deliveryTime:10,costForTwo:100,isVeg:true,isOpen:true,isPromoted:false,offers:[],imageKeyword:'chaat',phone:'011-89012345',menu:[
        {id:'m149',name:'Pani Puri',price:60,imageKeyword:'pani-puri',veg:true,rating:4.5},
        {id:'m150',name:'Papdi Chaat',price:80,imageKeyword:'papdi-chaat',veg:true,rating:4.4},
        {id:'m151',name:'Aloo Tikki',price:50,imageKeyword:'tandoori',veg:true,rating:4.3},
        {id:'m152',name:'Dahi Bhalla',price:70,imageKeyword:'idli',veg:true,rating:4.6}
    ]},
    {id:'r39',name:'Moti Mahal',cuisines:['North Indian','Mughlai'],city:'Delhi',locality:'Daryaganj',rating:4.5,totalRatings:6543,deliveryTime:30,costForTwo:600,isVeg:false,isOpen:true,isPromoted:false,offers:['15% off'],imageKeyword:'butter-chicken',phone:'011-90123456',menu:[
        {id:'m153',name:'Butter Chicken',price:320,imageKeyword:'butter-chicken',veg:false,rating:4.8},
        {id:'m154',name:'Tandoori Chicken',price:380,imageKeyword:'tandoori',veg:false,rating:4.7},
        {id:'m155',name:'Dal Makhani',price:220,imageKeyword:'dal-makhani',veg:true,rating:4.6},
        {id:'m156',name:'Naan',price:40,imageKeyword:'naan',veg:true,rating:4.5}
    ]},
    {id:'r40',name:'Gulati Restaurant',cuisines:['North Indian','Mughlai'],city:'Delhi',locality:'Pandara Road',rating:4.4,totalRatings:7654,deliveryTime:35,costForTwo:800,isVeg:false,isOpen:true,isPromoted:false,offers:[],imageKeyword:'korma',phone:'011-01234567',menu:[
        {id:'m157',name:'Chicken Korma',price:350,imageKeyword:'chicken-curry',veg:false,rating:4.6},
        {id:'m158',name:'Rogan Josh',price:420,imageKeyword:'mutton-rogan-josh',veg:false,rating:4.5},
        {id:'m159',name:'Paneer Butter Masala',price:280,imageKeyword:'paneer-tikka',veg:true,rating:4.4},
        {id:'m160',name:'Rasmalai',price:120,imageKeyword:'rasmalai',veg:true,rating:4.7}
    ]},
    {id:'r41',name:'Vaishali',cuisines:['South Indian','Vegetarian'],city:'Pune',locality:'FC Road',rating:4.6,totalRatings:11234,deliveryTime:20,costForTwo:300,isVeg:true,isOpen:true,isPromoted:true,offers:['Free delivery'],imageKeyword:'dosa',phone:'020-12345678',menu:[
        {id:'m161',name:'Masala Dosa',price:100,imageKeyword:'dosa',veg:true,rating:4.7},
        {id:'m162',name:'Idli',price:50,imageKeyword:'idli',veg:true,rating:4.6},
        {id:'m163',name:'Vada',price:40,imageKeyword:'tandoori',veg:true,rating:4.5},
        {id:'m164',name:'Sambar Rice',price:80,imageKeyword:'thali',veg:true,rating:4.4}
    ]},
    {id:'r42',name:'German Bakery',cuisines:['Bakery','Continental'],city:'Pune',locality:'Koregaon Park',rating:4.3,totalRatings:7654,deliveryTime:25,costForTwo:400,isVeg:false,isOpen:true,isPromoted:false,offers:['Buy 1 Get 1'],imageKeyword:'bakery',phone:'020-23456789',menu:[
        {id:'m165',name:'Sourdough Bread',price:180,imageKeyword:'bakery',veg:true,rating:4.5},
        {id:'m166',name:'Chicken Quiche',price:250,imageKeyword:'pizza',veg:false,rating:4.4},
        {id:'m167',name:'Croissant',price:120,imageKeyword:'bakery',veg:true,rating:4.6},
        {id:'m168',name:'Cappuccino',price:150,imageKeyword:'masala-chai',veg:true,rating:4.5}
    ]},
    {id:'r43',name:'George Restaurant',cuisines:['Continental','Goan'],city:'Pune',locality:'Bund Garden Road',rating:4.5,totalRatings:6543,deliveryTime:30,costForTwo:600,isVeg:false,isOpen:true,isPromoted:false,offers:[],imageKeyword:'goan',phone:'020-34567890',menu:[
        {id:'m169',name:'Goan Fish Curry',price:350,imageKeyword:'fish-curry',veg:false,rating:4.6},
        {id:'m170',name:'Chicken Xacuti',price:320,imageKeyword:'chicken-curry',veg:false,rating:4.5},
        {id:'m171',name:'Prawn Balchao',price:380,imageKeyword:'prawn-curry',veg:false,rating:4.7},
        {id:'m172',name:'Bebinca',price:180,imageKeyword:'cake',veg:true,rating:4.4}
    ]},
    {id:'r44',name:'Chaitanya Paratha',cuisines:['North Indian','Paratha'],city:'Pune',locality:'Deccan Gymkhana',rating:4.2,totalRatings:5432,deliveryTime:15,costForTwo:200,isVeg:true,isOpen:true,isPromoted:false,offers:['50% off'],imageKeyword:'paratha',phone:'020-45678901',menu:[
        {id:'m173',name:'Aloo Paratha',price:80,imageKeyword:'punjabi',veg:true,rating:4.5},
        {id:'m174',name:'Paneer Paratha',price:100,imageKeyword:'paneer-tikka',veg:true,rating:4.4},
        {id:'m175',name:'Curd',price:30,imageKeyword:'idli',veg:true,rating:4.3},
        {id:'m176',name:'Pickle',price:20,imageKeyword:'thali',veg:true,rating:4.2}
    ]},
    {id:'r45',name:'Punjabi Tadka',cuisines:['North Indian','Punjabi'],city:'Pune',locality:'Viman Nagar',rating:4.1,totalRatings:4321,deliveryTime:30,costForTwo:350,isVeg:false,isOpen:true,isPromoted:false,offers:[],imageKeyword:'punjabi',phone:'020-56789012',menu:[
        {id:'m177',name:'Butter Chicken',price:280,imageKeyword:'butter-chicken',veg:false,rating:4.4},
        {id:'m178',name:'Dal Tadka',price:180,imageKeyword:'dal-makhani',veg:true,rating:4.5},
        {id:'m179',name:'Tandoori Roti',price:35,imageKeyword:'tandoori-roti',veg:true,rating:4.3},
        {id:'m180',name:'Lassi',price:70,imageKeyword:'lassi',veg:true,rating:4.6}
    ]},
    {id:'r46',name:'Cafe Goodluck',cuisines:['Irani Cafe','Continental'],city:'Pune',locality:'Deccan Gymkhana',rating:4.7,totalRatings:9876,deliveryTime:20,costForTwo:400,isVeg:false,isOpen:true,isPromoted:true,offers:[],imageKeyword:'irani-cafe',phone:'020-67890123',menu:[
        {id:'m181',name:'Bun Maska',price:60,imageKeyword:'bakery',veg:true,rating:4.8},
        {id:'m182',name:'Keema Pav',price:220,imageKeyword:'chicken-curry',veg:false,rating:4.7},
        {id:'m183',name:'Irani Chai',price:40,imageKeyword:'masala-chai',veg:true,rating:4.9},
        {id:'m184',name:'Sali Per Eduri',price:280,imageKeyword:'chicken-curry',veg:false,rating:4.6}
    ]},
    {id:'r47',name:'Malaka Spice',cuisines:['South East Asian','Thai'],city:'Pune',locality:'Koregaon Park',rating:4.4,totalRatings:5432,deliveryTime:35,costForTwo:800,isVeg:false,isOpen:true,isPromoted:false,offers:['20% off'],imageKeyword:'thai',phone:'020-78901234',menu:[
        {id:'m185',name:'Pad Thai',price:280,imageKeyword:'noodles',veg:false,rating:4.5},
        {id:'m186',name:'Green Curry',price:320,imageKeyword:'chicken-curry',veg:false,rating:4.6},
        {id:'m187',name:'Tom Kha Soup',price:220,imageKeyword:'fish-curry',veg:false,rating:4.4},
        {id:'m188',name:'Mango Sticky Rice',price:180,imageKeyword:'rasmalai',veg:true,rating:4.7}
    ]},
    {id:'r48',name:'Sujata Mastani',cuisines:['Desserts','Beverages'],city:'Pune',locality:'Narayan Peth',rating:4.8,totalRatings:7654,deliveryTime:15,costForTwo:150,isVeg:true,isOpen:true,isPromoted:false,offers:[],imageKeyword:'mastani',phone:'020-89012345',menu:[
        {id:'m189',name:'Mastani',price:80,imageKeyword:'mango-lassi',veg:true,rating:4.9},
        {id:'m190',name:'Cold Coffee',price:70,imageKeyword:'cold-coffee',veg:true,rating:4.7},
        {id:'m191',name:'Falooda',price:90,imageKeyword:'lemon-mint-mojito',veg:true,rating:4.8},
        {id:'m192',name:'Ice Cream Sandwich',price:60,imageKeyword:'kulfi',veg:true,rating:4.6}
    ]},
    {id:'r49',name:'Bangkok Street',cuisines:['Thai','Chinese'],city:'Pune',locality:'Aundh',rating:4.2,totalRatings:4321,deliveryTime:30,costForTwo:500,isVeg:false,isOpen:true,isPromoted:false,offers:['30% off'],imageKeyword:'thai',phone:'020-90123456',menu:[
        {id:'m193',name:'Pad See Ew',price:250,imageKeyword:'noodles',veg:false,rating:4.4},
        {id:'m194',name:'Massaman Curry',price:320,imageKeyword:'chicken-curry',veg:false,rating:4.5},
        {id:'m195',name:'Spring Rolls',price:150,imageKeyword:'noodles',veg:true,rating:4.3},
        {id:'m196',name:'Thai Iced Tea',price:120,imageKeyword:'cold-coffee',veg:true,rating:4.6}
    ]},
    {id:'r50',name:'Pasha',cuisines:['Middle Eastern','Grill'],city:'Pune',locality:'Koregaon Park',rating:4.3,totalRatings:3210,deliveryTime:40,costForTwo:1000,isVeg:false,isOpen:true,isPromoted:false,offers:[],imageKeyword:'grill',phone:'020-01234567',menu:[
        {id:'m197',name:'Mixed Grill Platter',price:580,imageKeyword:'tandoori',veg:false,rating:4.5},
        {id:'m198',name:'Shawarma',price:250,imageKeyword:'burger',veg:false,rating:4.4},
        {id:'m199',name:'Hummus',price:180,imageKeyword:'thali',veg:true,rating:4.6},
        {id:'m200',name:'Baklava',price:220,imageKeyword:'rasmalai',veg:true,rating:4.7}
    ]},
    {id:'r51',name:'Paradise Biryani',cuisines:['Biryani','Hyderabadi'],city:'Hyderabad',locality:'Secunderabad',rating:4.6,totalRatings:15672,deliveryTime:30,costForTwo:350,isVeg:false,isOpen:true,isPromoted:true,offers:['40% off'],imageKeyword:'biryani',phone:'040-12345678',menu:[
        {id:'m201',name:'Chicken Biryani',price:280,imageKeyword:'biryani',veg:false,rating:4.7},
        {id:'m202',name:'Mutton Biryani',price:380,imageKeyword:'biryani',veg:false,rating:4.8},
        {id:'m203',name:'Chicken 65',price:180,imageKeyword:'chicken-65',veg:false,rating:4.5},
        {id:'m204',name:'Raita',price:40,imageKeyword:'idli',veg:true,rating:4.4}
    ]},
    {id:'r52',name:'Bawarchi',cuisines:['Biryani','Hyderabadi'],city:'Hyderabad',locality:'RTC Cross Roads',rating:4.7,totalRatings:11234,deliveryTime:25,costForTwo:300,isVeg:false,isOpen:true,isPromoted:true,offers:[],imageKeyword:'biryani',phone:'040-23456789',menu:[
        {id:'m205',name:'Special Biryani',price:320,imageKeyword:'biryani',veg:false,rating:4.8},
        {id:'m206',name:'Chicken Fry Piece',price:220,imageKeyword:'tandoori',veg:false,rating:4.6},
        {id:'m207',name:'Haleem',price:280,imageKeyword:'dal-makhani',veg:false,rating:4.7},
        {id:'m208',name:'Double Ka Meetha',price:120,imageKeyword:'rasmalai',veg:true,rating:4.5}
    ]},
    {id:'r53',name:'Mehfil Restaurant',cuisines:['Hyderabadi','North Indian'],city:'Hyderabad',locality:'Banjara Hills',rating:4.4,totalRatings:8765,deliveryTime:35,costForTwo:500,isVeg:false,isOpen:true,isPromoted:false,offers:['20% off'],imageKeyword:'hyderabadi',phone:'040-34567890',menu:[
        {id:'m209',name:'Haleem',price:320,imageKeyword:'dal-makhani',veg:false,rating:4.6},
        {id:'m210',name:'Lukhmi',price:180,imageKeyword:'tandoori',veg:false,rating:4.5},
        {id:'m211',name:'Chicken Korma',price:350,imageKeyword:'chicken-curry',veg:false,rating:4.4},
        {id:'m212',name:'Phirni',price:80,imageKeyword:'rasmalai',veg:true,rating:4.7}
    ]},
    {id:'r54',name:'Chutneys',cuisines:['South Indian','Vegetarian'],city:'Hyderabad',locality:'Jubilee Hills',rating:4.5,totalRatings:7654,deliveryTime:20,costForTwo:250,isVeg:true,isOpen:true,isPromoted:false,offers:['Free delivery'],imageKeyword:'dosa',phone:'040-45678901',menu:[
        {id:'m213',name:'Ghee Dosa',price:140,imageKeyword:'dosa',veg:true,rating:4.7},
        {id:'m214',name:'Idli',price:70,imageKeyword:'idli',veg:true,rating:4.6},
        {id:'m215',name:'Pongal',price:90,imageKeyword:'thali',veg:true,rating:4.5},
        {id:'m216',name:'Filter Coffee',price:40,imageKeyword:'filter-coffee',veg:true,rating:4.8}
    ]},
    {id:'r55',name:'Shah Ghouse',cuisines:['Hyderabadi','Biryani'],city:'Hyderabad',locality:'Tolichowki',rating:4.3,totalRatings:9876,deliveryTime:30,costForTwo:400,isVeg:false,isOpen:true,isPromoted:false,offers:[],imageKeyword:'biryani',phone:'040-56789012',menu:[
        {id:'m217',name:'Chicken Biryani',price:260,imageKeyword:'biryani',veg:false,rating:4.5},
        {id:'m218',name:'Haleem',price:280,imageKeyword:'dal-makhani',veg:false,rating:4.6},
        {id:'m219',name:'Tandoori Chicken',price:320,imageKeyword:'tandoori',veg:false,rating:4.4},
        {id:'m220',name:'Qubani Ka Meetha',price:100,imageKeyword:'rasmalai',veg:true,rating:4.7}
    ]},
    {id:'r56',name:'Cream Stone',cuisines:['Ice Cream','Desserts'],city:'Hyderabad',locality:'Banjara Hills',rating:4.8,totalRatings:6543,deliveryTime:15,costForTwo:200,isVeg:true,isOpen:true,isPromoted:false,offers:['Buy 2 Get 1'],imageKeyword:'ice-cream',phone:'040-67890123',menu:[
        {id:'m221',name:'Virgin Mojito Sizzle',price:180,imageKeyword:'lemon-mint-mojito',veg:true,rating:4.8},
        {id:'m222',name:'Butterscotch Sizzle',price:200,imageKeyword:'kulfi',veg:true,rating:4.7},
        {id:'m223',name:'Mud Pie Sizzle',price:220,imageKeyword:'cake',veg:true,rating:4.6},
        {id:'m224',name:'Chocolate Chip Cookie',price:150,imageKeyword:'cake',veg:true,rating:4.5}
    ]},
    {id:'r57',name:'Ohri\'s Tansen',cuisines:['North Indian','Mughlai'],city:'Hyderabad',locality:'Banjara Hills',rating:4.2,totalRatings:5432,deliveryTime:40,costForTwo:700,isVeg:false,isOpen:true,isPromoted:false,offers:['15% off'],imageKeyword:'mughlai',phone:'040-78901234',menu:[
        {id:'m225',name:'Murgh Musallam',price:480,imageKeyword:'tandoori',veg:false,rating:4.5},
        {id:'m226',name:'Galouti Kebab',price:380,imageKeyword:'tandoori',veg:false,rating:4.6},
        {id:'m227',name:'Naan',price:50,imageKeyword:'naan',veg:true,rating:4.3},
        {id:'m228',name:'Shahi Tukda',price:150,imageKeyword:'rasmalai',veg:true,rating:4.7}
    ]},
    {id:'r58',name:'Falaknuma Palace',cuisines:['Royal Indian','Mughlai'],city:'Hyderabad',locality:'Falaknuma',rating:4.9,totalRatings:3210,deliveryTime:60,costForTwo:3500,isVeg:false,isOpen:true,isPromoted:true,offers:[],imageKeyword:'royal',phone:'040-89012345',menu:[
        {id:'m229',name:'Royal Biryani',price:680,imageKeyword:'biryani',veg:false,rating:4.9},
        {id:'m230',name:'Haleem',price:420,imageKeyword:'dal-makhani',veg:false,rating:4.8},
        {id:'m231',name:'Pasinda',price:520,imageKeyword:'chicken-curry',veg:false,rating:4.7},
        {id:'m232',name:'Double Ka Meetha',price:180,imageKeyword:'rasmalai',veg:true,rating:4.8}
    ]},
    {id:'r59',name:'Santosh Dhaba',cuisines:['North Indian','Punjabi'],city:'Hyderabad',locality:'Secunderabad',rating:4.1,totalRatings:4321,deliveryTime:25,costForTwo:300,isVeg:false,isOpen:true,isPromoted:false,offers:['50% off'],imageKeyword:'dhaba',phone:'040-90123456',menu:[
        {id:'m233',name:'Butter Chicken',price:250,imageKeyword:'butter-chicken',veg:false,rating:4.4},
        {id:'m234',name:'Dal Makhani',price:180,imageKeyword:'dal-makhani',veg:true,rating:4.5},
        {id:'m235',name:'Tandoori Roti',price:30,imageKeyword:'tandoori-roti',veg:true,rating:4.3},
        {id:'m236',name:'Lassi',price:60,imageKeyword:'lassi',veg:true,rating:4.6}
    ]},
    {id:'r60',name:'Eat Street',cuisines:['Street Food','Chinese'],city:'Hyderabad',locality:'Madhapur',rating:4.3,totalRatings:6543,deliveryTime:20,costForTwo:200,isVeg:false,isOpen:true,isPromoted:false,offers:[],imageKeyword:'street-food',phone:'040-01234567',menu:[
        {id:'m237',name:'Vada Pav',price:40,imageKeyword:'pani-puri',veg:true,rating:4.4},
        {id:'m238',name:'Dahi Puri',price:60,imageKeyword:'pani-puri',veg:true,rating:4.5},
        {id:'m239',name:'Hakka Noodles',price:120,imageKeyword:'noodles',veg:false,rating:4.3},
        {id:'m240',name:'Manchurian',price:140,imageKeyword:'veg-manchurian',veg:false,rating:4.4}
    ]},
    {id:'r61',name:'Murugan Idli Shop',cuisines:['South Indian','Vegetarian'],city:'Chennai',locality:'T Nagar',rating:4.7,totalRatings:11234,deliveryTime:15,costForTwo:200,isVeg:true,isOpen:true,isPromoted:true,offers:['Free delivery'],imageKeyword:'idli',phone:'044-12345678',menu:[
        {id:'m241',name:'Kushboo Idli',price:60,imageKeyword:'idli',veg:true,rating:4.8},
        {id:'m242',name:'Ghee Podi Dosa',price:120,imageKeyword:'dosa',veg:true,rating:4.7},
        {id:'m243',name:'Medu Vada',price:50,imageKeyword:'tandoori',veg:true,rating:4.6},
        {id:'m244',name:'Filter Coffee',price:35,imageKeyword:'filter-coffee',veg:true,rating:4.9}
    ]},
    {id:'r62',name:'Saravana Bhavan',cuisines:['South Indian','Vegetarian'],city:'Chennai',locality:'Anna Salai',rating:4.5,totalRatings:9876,deliveryTime:20,costForTwo:250,isVeg:true,isOpen:true,isPromoted:true,offers:[],imageKeyword:'dosa',phone:'044-23456789',menu:[
        {id:'m245',name:'Masala Dosa',price:100,imageKeyword:'dosa',veg:true,rating:4.6},
        {id:'m246',name:'Thali',price:200,imageKeyword:'thali',veg:true,rating:4.5},
        {id:'m247',name:'Poori',price:70,imageKeyword:'punjabi',veg:true,rating:4.4},
        {id:'m248',name:'Payasam',price:50,imageKeyword:'rasmalai',veg:true,rating:4.7}
    ]},
    {id:'r63',name:'The Marina',cuisines:['Seafood','Coastal'],city:'Chennai',locality:'Marina Beach',rating:4.4,totalRatings:7654,deliveryTime:25,costForTwo:400,isVeg:false,isOpen:true,isPromoted:false,offers:['20% off'],imageKeyword:'fish-curry',phone:'044-34567890',menu:[
        {id:'m249',name:'Fish Curry Rice',price:280,imageKeyword:'fish-curry',veg:false,rating:4.6},
        {id:'m250',name:'Prawn Fry',price:320,imageKeyword:'prawn-curry',veg:false,rating:4.5},
        {id:'m251',name:'Crab Masala',price:380,imageKeyword:'fish-curry',veg:false,rating:4.4},
        {id:'m252',name:'Appam',price:60,imageKeyword:'idli',veg:true,rating:4.3}
    ]},
    {id:'r64',name:'Ciclo Cafe',cuisines:['Italian','Cafe'],city:'Chennai',locality:'Nungambakkam',rating:4.2,totalRatings:5432,deliveryTime:30,costForTwo:500,isVeg:false,isOpen:true,isPromoted:false,offers:['Happy Hours'],imageKeyword:'pizza',phone:'044-45678901',menu:[
        {id:'m253',name:'Margherita Pizza',price:280,imageKeyword:'pizza',veg:true,rating:4.4},
        {id:'m254',name:'Cafe Latte',price:150,imageKeyword:'masala-chai',veg:true,rating:4.5},
        {id:'m255',name:'Pasta Aglio Olio',price:250,imageKeyword:'pasta',veg:true,rating:4.3},
        {id:'m256',name:'Tiramisu',price:200,imageKeyword:'cake',veg:true,rating:4.6}
    ]},
    {id:'r65',name:'6 Ballygunge Place',cuisines:['Bengali','Fish'],city:'Kolkata',locality:'Ballygunge',rating:4.6,totalRatings:8765,deliveryTime:35,costForTwo:600,isVeg:false,isOpen:true,isPromoted:true,offers:['20% off'],imageKeyword:'fish-curry',phone:'033-12345678',menu:[
        {id:'m257',name:'Ilish Bhapa',price:480,imageKeyword:'fish-curry',veg:false,rating:4.8},
        {id:'m258',name:'Chingri Malai Curry',price:420,imageKeyword:'prawn-curry',veg:false,rating:4.7},
        {id:'m259',name:'Kosha Mangsho',price:350,imageKeyword:'mutton-rogan-josh',veg:false,rating:4.6},
        {id:'m260',name:'Mishti Doi',price:80,imageKeyword:'rasmalai',veg:true,rating:4.9}
    ]},
    {id:'r66',name:'Peter Cat',cuisines:['Continental','Kebabs'],city:'Kolkata',locality:'Park Street',rating:4.5,totalRatings:9876,deliveryTime:30,costForTwo:700,isVeg:false,isOpen:true,isPromoted:true,offers:['15% off'],imageKeyword:'kebab',phone:'033-23456789',menu:[
        {id:'m261',name:'Chelo Kebab',price:380,imageKeyword:'tandoori',veg:false,rating:4.7},
        {id:'m262',name:'Masala Papad',price:80,imageKeyword:'tandoori',veg:true,rating:4.4},
        {id:'m263',name:'Fish Finger',price:280,imageKeyword:'fish-curry',veg:false,rating:4.5},
        {id:'m264',name:'Brownie',price:150,imageKeyword:'cake',veg:true,rating:4.6}
    ]},
    {id:'r67',name:'Nizam\'s',cuisines:['Mughlai','Kathi Rolls'],city:'Kolkata',locality:'New Market',rating:4.4,totalRatings:11234,deliveryTime:20,costForTwo:300,isVeg:false,isOpen:true,isPromoted:false,offers:[],imageKeyword:'biryani',phone:'033-34567890',menu:[
        {id:'m265',name:'Chicken Kathi Roll',price:150,imageKeyword:'tandoori',veg:false,rating:4.6},
        {id:'m266',name:'Mutton Kathi Roll',price:200,imageKeyword:'tandoori',veg:false,rating:4.7},
        {id:'m267',name:'Egg Roll',price:100,imageKeyword:'tandoori',veg:false,rating:4.4},
        {id:'m268',name:'Lassi',price:60,imageKeyword:'lassi',veg:true,rating:4.5}
    ]},
    {id:'r68',name:'Flurys',cuisines:['Bakery','Continental'],city:'Kolkata',locality:'Park Street',rating:4.7,totalRatings:7654,deliveryTime:25,costForTwo:500,isVeg:false,isOpen:true,isPromoted:true,offers:[],imageKeyword:'bakery',phone:'033-45678901',menu:[
        {id:'m269',name:'Swiss Roll',price:180,imageKeyword:'bakery',veg:true,rating:4.8},
        {id:'m270',name:'Chicken Patty',price:150,imageKeyword:'burger',veg:false,rating:4.5},
        {id:'m271',name:'Croissant',price:120,imageKeyword:'bakery',veg:true,rating:4.6},
        {id:'m272',name:'Tea',price:50,imageKeyword:'masala-chai',veg:true,rating:4.7}
    ]},
    {id:'r69',name:'Kusum Rolls',cuisines:['Street Food','Kathi Rolls'],city:'Kolkata',locality:'Park Circus',rating:4.3,totalRatings:6543,deliveryTime:15,costForTwo:200,isVeg:false,isOpen:true,isPromoted:false,offers:['30% off'],imageKeyword:'street-food',phone:'033-56789012',menu:[
        {id:'m273',name:'Egg Roll',price:80,imageKeyword:'tandoori',veg:false,rating:4.5},
        {id:'m274',name:'Chicken Roll',price:120,imageKeyword:'tandoori',veg:false,rating:4.6},
        {id:'m275',name:'Double Egg Roll',price:100,imageKeyword:'tandoori',veg:false,rating:4.4},
        {id:'m276',name:'Mutton Roll',price:150,imageKeyword:'tandoori',veg:false,rating:4.7}
    ]},
    {id:'r70',name:'Arsalan',cuisines:['Biryani','Mughlai'],city:'Kolkata',locality:'Park Circus',rating:4.5,totalRatings:12345,deliveryTime:30,costForTwo:400,isVeg:false,isOpen:true,isPromoted:true,offers:['40% off'],imageKeyword:'biryani',phone:'033-67890123',menu:[
        {id:'m277',name:'Kolkata Biryani',price:280,imageKeyword:'biryani',veg:false,rating:4.8},
        {id:'m278',name:'Mutton Biryani',price:380,imageKeyword:'biryani',veg:false,rating:4.7},
        {id:'m279',name:'Chicken Rezala',price:320,imageKeyword:'chicken-curry',veg:false,rating:4.6},
        {id:'m280',name:'Firni',price:80,imageKeyword:'rasmalai',veg:true,rating:4.5}
    ]},
    {id:'r71',name:'Bar-B-Q',cuisines:['Mughlai','BBQ'],city:'Kolkata',locality:'Shakespeare Sarani',rating:4.2,totalRatings:5432,deliveryTime:35,costForTwo:550,isVeg:false,isOpen:true,isPromoted:false,offers:[],imageKeyword:'barbeque',phone:'033-78901234',menu:[
        {id:'m281',name:'BBQ Chicken',price:320,imageKeyword:'barbeque',veg:false,rating:4.5},
        {id:'m282',name:'Seekh Kebab',price:280,imageKeyword:'tandoori',veg:false,rating:4.4},
        {id:'m283',name:'Tandoori Roti',price:40,imageKeyword:'tandoori-roti',veg:true,rating:4.3},
        {id:'m284',name:'Baklava',price:180,imageKeyword:'rasmalai',veg:true,rating:4.6}
    ]},
    {id:'r72',name:'Olypub',cuisines:['Continental','Chinese'],city:'Kolkata',locality:'Camac Street',rating:4.1,totalRatings:4321,deliveryTime:25,costForTwo:450,isVeg:false,isOpen:true,isPromoted:false,offers:['Happy Hours'],imageKeyword:'continental',phone:'033-89012345',menu:[
        {id:'m285',name:'Chicken Steak',price:380,imageKeyword:'chicken-curry',veg:false,rating:4.3},
        {id:'m286',name:'Fish Fingers',price:280,imageKeyword:'fish-curry',veg:false,rating:4.4},
        {id:'m287',name:'Hakka Noodles',price:220,imageKeyword:'noodles',veg:false,rating:4.2},
        {id:'m288',name:'Beer',price:250,imageKeyword:'lemon-mint-mojito',veg:true,rating:4.5}
    ]},
    {id:'r73',name:'Agarwal Sweets',cuisines:['Vegetarian','Sweets'],city:'Kolkata',locality:'Ballygunge',rating:4.6,totalRatings:8765,deliveryTime:15,costForTwo:250,isVeg:true,isOpen:true,isPromoted:false,offers:['Free delivery'],imageKeyword:'gulab-jamun',phone:'033-90123456',menu:[
        {id:'m289',name:'Rasgulla',price:60,imageKeyword:'rasmalai',veg:true,rating:4.7},
        {id:'m290',name:'Gulab Jamun',price:50,imageKeyword:'gulab-jamun',veg:true,rating:4.6},
        {id:'m291',name:'Samosa',price:30,imageKeyword:'tandoori',veg:true,rating:4.5},
        {id:'m292',name:'Jalebi',price:40,imageKeyword:'gajar-halwa',veg:true,rating:4.4}
    ]},
    {id:'r74',name:'Mainland China',cuisines:['Chinese','Asian'],city:'Kolkata',locality:'Park Street',rating:4.4,totalRatings:6543,deliveryTime:40,costForTwo:800,isVeg:false,isOpen:true,isPromoted:true,offers:[],imageKeyword:'noodles',phone:'033-01234567',menu:[
        {id:'m293',name:'Dim Sum Platter',price:480,imageKeyword:'veg-manchurian',veg:false,rating:4.6},
        {id:'m294',name:'Peking Duck',price:680,imageKeyword:'tandoori',veg:false,rating:4.7},
        {id:'m295',name:'Hot Sour Soup',price:180,imageKeyword:'fish-curry',veg:false,rating:4.4},
        {id:'m296',name:'Fried Rice',price:220,imageKeyword:'chicken-fried-rice',veg:false,rating:4.5}
    ]},
    {id:'r75',name:'Mani\'s',cuisines:['North Indian','Gujarati'],city:'Ahmedabad',locality:'CG Road',rating:4.7,totalRatings:9876,deliveryTime:25,costForTwo:400,isVeg:true,isOpen:true,isPromoted:true,offers:['20% off'],imageKeyword:'thali',phone:'079-12345678',menu:[
        {id:'m297',name:'Unlimited Thali',price:250,imageKeyword:'thali',veg:true,rating:4.8},
        {id:'m298',name:'Dhokla',price:80,imageKeyword:'tandoori',veg:true,rating:4.7},
        {id:'m299',name:'Khandvi',price:70,imageKeyword:'noodles',veg:true,rating:4.6},
        {id:'m300',name:'Chaas',price:40,imageKeyword:'lassi',veg:true,rating:4.5}
    ]},
    {id:'r76',name:'Gordhan Thal',cuisines:['Gujarati','Rajasthani'],city:'Ahmedabad',locality:'Law Garden',rating:4.6,totalRatings:8765,deliveryTime:20,costForTwo:350,isVeg:true,isOpen:true,isPromoted:false,offers:[],imageKeyword:'thali',phone:'079-23456789',menu:[
        {id:'m301',name:'Royal Thali',price:280,imageKeyword:'thali',veg:true,rating:4.7},
        {id:'m302',name:'Sev Tameta Nu Shaak',price:120,imageKeyword:'thali',veg:true,rating:4.5},
        {id:'m303',name:'Bajra Rotla',price:60,imageKeyword:'tandoori-roti',veg:true,rating:4.6},
        {id:'m304',name:'Mohanthal',price:80,imageKeyword:'gajar-halwa',veg:true,rating:4.8}
    ]},
    {id:'r77',name:'Vishalla',cuisines:['Gujarati','Folk'],city:'Ahmedabad',locality:'Vatva',rating:4.8,totalRatings:7654,deliveryTime:30,costForTwo:500,isVeg:true,isOpen:true,isPromoted:true,offers:['15% off'],imageKeyword:'punjabi',phone:'079-34567890',menu:[
        {id:'m305',name:'Vishalla Thali',price:320,imageKeyword:'thali',veg:true,rating:4.9},
        {id:'m306',name:'Undhiyu',price:180,imageKeyword:'thali',veg:true,rating:4.8},
        {id:'m307',name:'Rotla',price:50,imageKeyword:'tandoori-roti',veg:true,rating:4.7},
        {id:'m308',name:'Shrikhand',price:100,imageKeyword:'rasmalai',veg:true,rating:4.6}
    ]},
    {id:'r78',name:'Agashiye',cuisines:['Gujarati','Vegetarian'],city:'Ahmedabad',locality:'Ashram Road',rating:4.5,totalRatings:6543,deliveryTime:35,costForTwo:600,isVeg:true,isOpen:true,isPromoted:false,offers:[],imageKeyword:'dosa',phone:'079-45678901',menu:[
        {id:'m309',name:'Fafda Jalebi',price:100,imageKeyword:'gajar-halwa',veg:true,rating:4.7},
        {id:'m310',name:'Thepla',price:60,imageKeyword:'tandoori-roti',veg:true,rating:4.5},
        {id:'m311',name:'Kadhi',price:80,imageKeyword:'dal-makhani',veg:true,rating:4.6},
        {id:'m312',name:'Basundi',price:90,imageKeyword:'rasmalai',veg:true,rating:4.8}
    ]},
    {id:'r79',name:'Rajwadu',cuisines:['Gujarati','North Indian'],city:'Ahmedabad',locality:'SG Highway',rating:4.4,totalRatings:5432,deliveryTime:40,costForTwo:550,isVeg:true,isOpen:true,isPromoted:true,offers:['30% off'],imageKeyword:'punjabi',phone:'079-56789012',menu:[
        {id:'m313',name:'Rajwadu Thali',price:300,imageKeyword:'thali',veg:true,rating:4.7},
        {id:'m314',name:'Dal Baati',price:180,imageKeyword:'dal-makhani',veg:true,rating:4.6},
        {id:'m315',name:'Bajra Roti',price:50,imageKeyword:'tandoori-roti',veg:true,rating:4.5},
        {id:'m316',name:'Malpua',price:80,imageKeyword:'gajar-halwa',veg:true,rating:4.8}
    ]},
    {id:'r80',name:'Makhan Lal',cuisines:['Sweets','Vegetarian'],city:'Ahmedabad',locality:'Relief Road',rating:4.7,totalRatings:8765,deliveryTime:15,costForTwo:200,isVeg:true,isOpen:true,isPromoted:false,offers:['Buy 2 Get 1'],imageKeyword:'gulab-jamun',phone:'079-67890123',menu:[
        {id:'m317',name:'Gulab Jamun',price:60,imageKeyword:'gulab-jamun',veg:true,rating:4.8},
        {id:'m318',name:'Jalebi',price:50,imageKeyword:'gajar-halwa',veg:true,rating:4.7},
        {id:'m319',name:'Fafda',price:70,imageKeyword:'tandoori',veg:true,rating:4.6},
        {id:'m320',name:'Mohanthal',price:80,imageKeyword:'gajar-halwa',veg:true,rating:4.5}
    ]},
    {id:'r81',name:'Sankalp',cuisines:['South Indian','Vegetarian'],city:'Ahmedabad',locality:'CG Road',rating:4.3,totalRatings:6543,deliveryTime:20,costForTwo:300,isVeg:true,isOpen:true,isPromoted:false,offers:['Free delivery'],imageKeyword:'dosa',phone:'079-78901234',menu:[
        {id:'m321',name:'Sankalp Special Dosa',price:140,imageKeyword:'dosa',veg:true,rating:4.6},
        {id:'m322',name:'Idli',price:70,imageKeyword:'idli',veg:true,rating:4.5},
        {id:'m323',name:'Uttapam',price:100,imageKeyword:'tandoori',veg:true,rating:4.4},
        {id:'m324',name:'Filter Coffee',price:40,imageKeyword:'filter-coffee',veg:true,rating:4.7}
    ]},
    {id:'r82',name:'Honorable',cuisines:['Chinese','Indian'],city:'Ahmedabad',locality:'Satellite',rating:4.2,totalRatings:5432,deliveryTime:25,costForTwo:450,isVeg:false,isOpen:true,isPromoted:false,offers:['10% off'],imageKeyword:'noodles',phone:'079-89012345',menu:[
        {id:'m325',name:'Hakka Noodles',price:180,imageKeyword:'noodles',veg:false,rating:4.4},
        {id:'m326',name:'Manchurian',price:200,imageKeyword:'veg-manchurian',veg:false,rating:4.5},
        {id:'m327',name:'Fried Rice',price:160,imageKeyword:'chicken-fried-rice',veg:false,rating:4.3},
        {id:'m328',name:'Soup',price:100,imageKeyword:'fish-curry',veg:false,rating:4.2}
    ]},
    {id:'r83',name:'The Chocolate Room',cuisines:['Desserts','Cafe'],city:'Ahmedabad',locality:'CG Road',rating:4.6,totalRatings:7654,deliveryTime:20,costForTwo:500,isVeg:false,isOpen:true,isPromoted:true,offers:[],imageKeyword:'cake',phone:'079-90123456',menu:[
        {id:'m329',name:'Chocolate Fondue',price:320,imageKeyword:'cake',veg:true,rating:4.8},
        {id:'m330',name:'Waffle',price:250,imageKeyword:'cake',veg:true,rating:4.6},
        {id:'m331',name:'Hot Chocolate',price:180,imageKeyword:'cold-coffee',veg:true,rating:4.7},
        {id:'m332',name:'Brownie Sundae',price:280,imageKeyword:'cake',veg:true,rating:4.5}
    ]},
    {id:'r84',name:'Cafe De Italiano',cuisines:['Italian','Cafe'],city:'Ahmedabad',locality:'Bodakdev',rating:4.1,totalRatings:4321,deliveryTime:30,costForTwo:700,isVeg:false,isOpen:true,isPromoted:false,offers:['Happy Hours'],imageKeyword:'pizza',phone:'079-01234567',menu:[
        {id:'m333',name:'Margherita Pizza',price:280,imageKeyword:'pizza',veg:true,rating:4.3},
        {id:'m334',name:'Penne Arrabiata',price:320,imageKeyword:'pasta',veg:true,rating:4.4},
        {id:'m335',name:'Caesar Salad',price:250,imageKeyword:'tandoori',veg:true,rating:4.2},
        {id:'m336',name:'Cappuccino',price:150,imageKeyword:'masala-chai',veg:true,rating:4.5}
    ]}
];

export default RESTAURANTS;
