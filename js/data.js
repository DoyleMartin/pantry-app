// ============================================================
// DATA.JS — Recipe database
// ============================================================
const RECIPES = [
  {id:'r1', name:'Spaghetti Carbonara', category:'Italian', cookTime:20,
   ingredients:[{n:'spaghetti',q:200,u:'g'},{n:'bacon',q:150,u:'g'},{n:'eggs',q:3,u:'pieces'},{n:'parmesan cheese',q:50,u:'g'},{n:'garlic',q:2,u:'cloves'},{n:'black pepper',q:1,u:'tsp'}],
   instructions:'1. Cook spaghetti in salted water until al dente.\n2. Fry bacon until crispy, add minced garlic.\n3. Beat eggs with grated parmesan and pepper.\n4. Drain pasta (save 1 cup pasta water). Toss pasta with bacon pan off heat.\n5. Stir in egg mixture quickly, adding pasta water to make creamy.\n6. Serve immediately with extra parmesan.',
   tags:['pasta','quick','italian']},

  {id:'r2', name:'Chicken Stir Fry', category:'Asian', cookTime:25,
   ingredients:[{n:'chicken breast',q:300,u:'g'},{n:'broccoli',q:200,u:'g'},{n:'soy sauce',q:3,u:'tbsp'},{n:'garlic',q:3,u:'cloves'},{n:'ginger',q:1,u:'tsp'},{n:'vegetable oil',q:2,u:'tbsp'},{n:'cornstarch',q:1,u:'tbsp'}],
   instructions:'1. Slice chicken thin and toss with cornstarch.\n2. Heat oil in wok or large pan over high heat.\n3. Cook chicken until golden, set aside.\n4. Stir fry garlic, ginger, then broccoli for 3 min.\n5. Return chicken, add soy sauce, toss everything together.\n6. Serve over rice.',
   tags:['asian','quick','healthy']},

  {id:'r3', name:'Mac and Cheese', category:'American', cookTime:20,
   ingredients:[{n:'macaroni',q:250,u:'g'},{n:'butter',q:3,u:'tbsp'},{n:'all-purpose flour',q:3,u:'tbsp'},{n:'milk',q:2,u:'cup'},{n:'cheddar cheese',q:200,u:'g'},{n:'salt',q:1,u:'tsp'}],
   instructions:'1. Cook macaroni until al dente, drain.\n2. Melt butter in pot, whisk in flour, cook 1 min.\n3. Gradually whisk in milk until smooth and thick.\n4. Add grated cheddar, stir until melted.\n5. Season with salt, fold in pasta. Serve hot.',
   tags:['comfort','quick','vegetarian']},

  {id:'r4', name:'Scrambled Eggs & Toast', category:'Breakfast', cookTime:10,
   ingredients:[{n:'eggs',q:3,u:'pieces'},{n:'butter',q:1,u:'tbsp'},{n:'bread',q:2,u:'pieces'},{n:'milk',q:2,u:'tbsp'},{n:'salt',q:1,u:'tsp'}],
   instructions:'1. Whisk eggs with milk and salt.\n2. Melt butter in pan over medium-low heat.\n3. Pour in eggs, gently stir with spatula as they set.\n4. Remove while still slightly wet — they continue cooking.\n5. Toast bread and serve together.',
   tags:['breakfast','quick','easy']},

  {id:'r5', name:'Tomato Soup', category:'Soup', cookTime:30,
   ingredients:[{n:'tomatoes',q:4,u:'pieces'},{n:'onion',q:1,u:'pieces'},{n:'garlic',q:3,u:'cloves'},{n:'chicken broth',q:500,u:'ml'},{n:'olive oil',q:2,u:'tbsp'},{n:'basil',q:1,u:'tsp'}],
   instructions:'1. Sauté onion and garlic in oil until soft.\n2. Add diced tomatoes and broth, simmer 20 min.\n3. Blend until smooth.\n4. Season with salt, pepper, and basil.\n5. Serve with crusty bread.',
   tags:['soup','vegetarian','comfort']},

  {id:'r6', name:'Beef Tacos', category:'Mexican', cookTime:25,
   ingredients:[{n:'ground beef',q:400,u:'g'},{n:'taco shells',q:8,u:'pieces'},{n:'taco seasoning',q:2,u:'tbsp'},{n:'cheddar cheese',q:100,u:'g'},{n:'lettuce',q:100,u:'g'},{n:'tomatoes',q:2,u:'pieces'},{n:'sour cream',q:100,u:'g'}],
   instructions:'1. Brown ground beef in pan, drain fat.\n2. Add taco seasoning and 1/4 cup water, simmer 5 min.\n3. Warm taco shells in oven.\n4. Fill shells with beef, top with cheese, lettuce, tomato, sour cream.',
   tags:['mexican','quick','family']},

  {id:'r7', name:'Pancakes', category:'Breakfast', cookTime:20,
   ingredients:[{n:'all-purpose flour',q:200,u:'g'},{n:'eggs',q:2,u:'pieces'},{n:'milk',q:250,u:'ml'},{n:'butter',q:2,u:'tbsp'},{n:'baking powder',q:2,u:'tsp'},{n:'sugar',q:2,u:'tbsp'},{n:'salt',q:0.5,u:'tsp'}],
   instructions:'1. Mix flour, sugar, baking powder, salt.\n2. In another bowl, mix eggs, milk, melted butter.\n3. Combine wet and dry — don\'t overmix, lumps are fine.\n4. Cook on buttered pan over medium heat, flip when bubbles form.\n5. Serve with maple syrup.',
   tags:['breakfast','classic','sweet']},

  {id:'r8', name:'Greek Salad', category:'Mediterranean', cookTime:10,
   ingredients:[{n:'cucumber',q:1,u:'pieces'},{n:'tomatoes',q:3,u:'pieces'},{n:'red onion',q:0.5,u:'pieces'},{n:'feta cheese',q:100,u:'g'},{n:'olives',q:50,u:'g'},{n:'olive oil',q:3,u:'tbsp'},{n:'oregano',q:1,u:'tsp'}],
   instructions:'1. Chop cucumber, tomatoes, and red onion into chunks.\n2. Combine in bowl with olives and crumbled feta.\n3. Drizzle with olive oil, sprinkle oregano.\n4. Toss gently and season with salt and pepper.',
   tags:['salad','vegetarian','healthy','quick']},

  {id:'r9', name:'Chicken Soup', category:'Soup', cookTime:45,
   ingredients:[{n:'chicken breast',q:300,u:'g'},{n:'carrots',q:3,u:'pieces'},{n:'celery',q:3,u:'stalks'},{n:'onion',q:1,u:'pieces'},{n:'garlic',q:2,u:'cloves'},{n:'chicken broth',q:1,u:'L'},{n:'egg noodles',q:100,u:'g'}],
   instructions:'1. Sauté onion, carrot, celery in pot until soft.\n2. Add garlic and chicken, cook 2 min.\n3. Pour in broth, bring to boil, simmer 25 min.\n4. Remove chicken, shred it, return to pot.\n5. Add noodles, cook 8 more min. Season to taste.',
   tags:['soup','comfort','classic']},

  {id:'r10', name:'Veggie Omelette', category:'Breakfast', cookTime:15,
   ingredients:[{n:'eggs',q:3,u:'pieces'},{n:'bell pepper',q:0.5,u:'pieces'},{n:'onion',q:0.5,u:'pieces'},{n:'mushrooms',q:50,u:'g'},{n:'cheddar cheese',q:30,u:'g'},{n:'butter',q:1,u:'tbsp'}],
   instructions:'1. Dice pepper, onion, mushrooms and sauté in butter.\n2. Beat eggs with a pinch of salt.\n3. Pour eggs into pan with veggies over medium heat.\n4. When eggs set on edges, add cheese and fold.\n5. Serve immediately.',
   tags:['breakfast','vegetarian','quick']},

  {id:'r11', name:'Fried Rice', category:'Asian', cookTime:20,
   ingredients:[{n:'cooked rice',q:300,u:'g'},{n:'eggs',q:2,u:'pieces'},{n:'soy sauce',q:3,u:'tbsp'},{n:'garlic',q:2,u:'cloves'},{n:'frozen peas',q:100,u:'g'},{n:'vegetable oil',q:2,u:'tbsp'},{n:'green onions',q:3,u:'pieces'}],
   instructions:'1. Use day-old cold rice for best results.\n2. Scramble eggs in hot oiled wok, push aside.\n3. Add garlic, then rice — stir fry on high heat.\n4. Add soy sauce, peas, stir everything together.\n5. Top with sliced green onions.',
   tags:['asian','quick','easy']},

  {id:'r12', name:'Grilled Cheese Sandwich', category:'American', cookTime:10,
   ingredients:[{n:'bread',q:2,u:'pieces'},{n:'cheddar cheese',q:60,u:'g'},{n:'butter',q:1,u:'tbsp'}],
   instructions:'1. Butter one side of each bread slice.\n2. Put cheese between slices (buttered sides out).\n3. Cook in pan over medium heat 3-4 min per side until golden.\n4. Serve hot.',
   tags:['quick','sandwich','comfort']},

  {id:'r13', name:'Pasta Marinara', category:'Italian', cookTime:25,
   ingredients:[{n:'pasta',q:200,u:'g'},{n:'canned tomatoes',q:400,u:'g'},{n:'garlic',q:3,u:'cloves'},{n:'olive oil',q:3,u:'tbsp'},{n:'basil',q:1,u:'tsp'},{n:'salt',q:1,u:'tsp'}],
   instructions:'1. Boil pasta in salted water until al dente.\n2. Sauté garlic in olive oil until golden.\n3. Add canned tomatoes and simmer 15 min.\n4. Season with salt and basil.\n5. Toss with pasta and serve.',
   tags:['pasta','vegetarian','italian','quick']},

  {id:'r14', name:'Beef Burgers', category:'American', cookTime:20,
   ingredients:[{n:'ground beef',q:400,u:'g'},{n:'burger buns',q:4,u:'pieces'},{n:'cheddar cheese',q:80,u:'g'},{n:'lettuce',q:80,u:'g'},{n:'tomatoes',q:2,u:'pieces'},{n:'onion',q:0.5,u:'pieces'},{n:'ketchup',q:2,u:'tbsp'}],
   instructions:'1. Season beef with salt and pepper, form 4 patties.\n2. Grill or pan-fry 4-5 min per side to desired doneness.\n3. Add cheese last minute to melt.\n4. Toast buns, assemble with toppings.',
   tags:['american','grilling','classic']},

  {id:'r15', name:'Banana Smoothie', category:'Breakfast', cookTime:5,
   ingredients:[{n:'banana',q:2,u:'pieces'},{n:'milk',q:250,u:'ml'},{n:'yogurt',q:100,u:'g'},{n:'honey',q:1,u:'tbsp'}],
   instructions:'1. Peel bananas and break into chunks.\n2. Add all ingredients to blender.\n3. Blend until smooth.\n4. Serve immediately.',
   tags:['breakfast','quick','healthy','sweet']},

  {id:'r16', name:'Baked Salmon', category:'Seafood', cookTime:25,
   ingredients:[{n:'salmon fillet',q:400,u:'g'},{n:'lemon',q:1,u:'pieces'},{n:'garlic',q:2,u:'cloves'},{n:'olive oil',q:2,u:'tbsp'},{n:'dill',q:1,u:'tsp'}],
   instructions:'1. Preheat oven to 400°F (200°C).\n2. Place salmon on baking sheet, drizzle with oil.\n3. Top with minced garlic, lemon slices, dill.\n4. Bake 15-18 min until flaky.\n5. Serve with vegetables.',
   tags:['seafood','healthy','quick']},

  {id:'r17', name:'Quesadillas', category:'Mexican', cookTime:15,
   ingredients:[{n:'flour tortillas',q:4,u:'pieces'},{n:'cheddar cheese',q:150,u:'g'},{n:'bell pepper',q:1,u:'pieces'},{n:'onion',q:0.5,u:'pieces'},{n:'butter',q:1,u:'tbsp'}],
   instructions:'1. Slice pepper and onion, sauté until soft.\n2. Lay tortilla flat, add cheese and veggies on half.\n3. Fold and cook in buttered pan until golden each side.\n4. Cut into wedges and serve with sour cream.',
   tags:['mexican','quick','vegetarian']},

  {id:'r18', name:'Minestrone Soup', category:'Italian', cookTime:40,
   ingredients:[{n:'canned tomatoes',q:400,u:'g'},{n:'kidney beans',q:400,u:'g'},{n:'zucchini',q:1,u:'pieces'},{n:'carrots',q:2,u:'pieces'},{n:'celery',q:2,u:'stalks'},{n:'onion',q:1,u:'pieces'},{n:'pasta',q:100,u:'g'},{n:'vegetable broth',q:1,u:'L'}],
   instructions:'1. Sauté onion, carrot, celery for 5 min.\n2. Add all vegetables, beans, tomatoes and broth.\n3. Simmer 20 min.\n4. Add pasta and cook 10 more min.\n5. Season and serve with crusty bread.',
   tags:['soup','vegetarian','italian']},

  {id:'r19', name:'French Toast', category:'Breakfast', cookTime:15,
   ingredients:[{n:'bread',q:4,u:'pieces'},{n:'eggs',q:2,u:'pieces'},{n:'milk',q:60,u:'ml'},{n:'butter',q:1,u:'tbsp'},{n:'sugar',q:1,u:'tbsp'},{n:'cinnamon',q:0.5,u:'tsp'}],
   instructions:'1. Whisk eggs, milk, sugar, cinnamon together.\n2. Dip bread slices in egg mixture, coat both sides.\n3. Cook in buttered pan over medium heat, 2-3 min per side.\n4. Serve with maple syrup or fresh fruit.',
   tags:['breakfast','sweet','classic']},

  {id:'r20', name:'Avocado Toast', category:'Breakfast', cookTime:5,
   ingredients:[{n:'bread',q:2,u:'pieces'},{n:'avocado',q:1,u:'pieces'},{n:'lemon',q:0.5,u:'pieces'},{n:'salt',q:0.5,u:'tsp'}],
   instructions:'1. Toast bread until golden.\n2. Mash avocado with lemon juice and salt.\n3. Spread on toast.\n4. Top with red pepper flakes or an egg if desired.',
   tags:['breakfast','healthy','quick','vegetarian']},

  {id:'r21', name:'Potato Soup', category:'Soup', cookTime:35,
   ingredients:[{n:'potatoes',q:4,u:'pieces'},{n:'onion',q:1,u:'pieces'},{n:'chicken broth',q:750,u:'ml'},{n:'butter',q:2,u:'tbsp'},{n:'milk',q:250,u:'ml'},{n:'cheddar cheese',q:80,u:'g'}],
   instructions:'1. Dice potatoes and onion.\n2. Sauté onion in butter until soft.\n3. Add potatoes and broth, simmer until tender (15 min).\n4. Mash partially for chunky texture.\n5. Stir in milk and cheese. Season and serve.',
   tags:['soup','comfort','vegetarian']},

  {id:'r22', name:'Chicken Fajitas', category:'Mexican', cookTime:20,
   ingredients:[{n:'chicken breast',q:300,u:'g'},{n:'bell pepper',q:2,u:'pieces'},{n:'onion',q:1,u:'pieces'},{n:'flour tortillas',q:4,u:'pieces'},{n:'taco seasoning',q:2,u:'tbsp'},{n:'vegetable oil',q:2,u:'tbsp'}],
   instructions:'1. Slice chicken, peppers, and onion into strips.\n2. Season chicken with taco seasoning.\n3. Cook chicken in oil over high heat, set aside.\n4. Sauté peppers and onion until slightly charred.\n5. Serve in warm tortillas.',
   tags:['mexican','quick','healthy']},

  {id:'r23', name:'Garlic Butter Shrimp', category:'Seafood', cookTime:15,
   ingredients:[{n:'shrimp',q:400,u:'g'},{n:'butter',q:3,u:'tbsp'},{n:'garlic',q:4,u:'cloves'},{n:'lemon',q:1,u:'pieces'},{n:'parsley',q:1,u:'tbsp'}],
   instructions:'1. Melt butter in pan over medium-high heat.\n2. Add minced garlic, cook 1 min.\n3. Add shrimp, cook 2-3 min per side until pink.\n4. Squeeze lemon and sprinkle parsley.\n5. Serve over pasta or rice.',
   tags:['seafood','quick','garlic']},

  {id:'r24', name:'Vegetable Curry', category:'Indian', cookTime:35,
   ingredients:[{n:'potatoes',q:2,u:'pieces'},{n:'carrots',q:2,u:'pieces'},{n:'onion',q:1,u:'pieces'},{n:'canned tomatoes',q:400,u:'g'},{n:'garlic',q:3,u:'cloves'},{n:'curry powder',q:2,u:'tbsp'},{n:'coconut milk',q:400,u:'ml'}],
   instructions:'1. Dice potatoes, carrots, and onion.\n2. Sauté onion and garlic until soft.\n3. Add curry powder, cook 1 min.\n4. Add vegetables, tomatoes, and coconut milk.\n5. Simmer 20 min until vegetables are tender.\n6. Serve over rice.',
   tags:['indian','vegetarian','comfort']},

  {id:'r25', name:'Mushroom Risotto', category:'Italian', cookTime:40,
   ingredients:[{n:'arborio rice',q:300,u:'g'},{n:'mushrooms',q:200,u:'g'},{n:'onion',q:1,u:'pieces'},{n:'garlic',q:2,u:'cloves'},{n:'chicken broth',q:1,u:'L'},{n:'parmesan cheese',q:60,u:'g'},{n:'butter',q:2,u:'tbsp'}],
   instructions:'1. Heat broth and keep warm.\n2. Sauté onion and garlic in butter.\n3. Add mushrooms, cook until golden.\n4. Add rice, stir to coat. Add broth ladle by ladle.\n5. Stir constantly until each addition absorbs.\n6. Finish with parmesan and butter.',
   tags:['italian','vegetarian','comfort']},

  {id:'r26', name:'BLT Sandwich', category:'American', cookTime:10,
   ingredients:[{n:'bread',q:2,u:'pieces'},{n:'bacon',q:4,u:'pieces'},{n:'lettuce',q:2,u:'pieces'},{n:'tomatoes',q:1,u:'pieces'},{n:'mayonnaise',q:1,u:'tbsp'}],
   instructions:'1. Cook bacon until crispy.\n2. Toast bread.\n3. Spread mayo on one slice.\n4. Layer lettuce, tomato slices, and bacon.\n5. Top with second bread slice and serve.',
   tags:['sandwich','quick','american']},

  {id:'r27', name:'Caprese Salad', category:'Italian', cookTime:5,
   ingredients:[{n:'tomatoes',q:3,u:'pieces'},{n:'mozzarella cheese',q:200,u:'g'},{n:'basil',q:10,u:'pieces'},{n:'olive oil',q:2,u:'tbsp'},{n:'salt',q:0.5,u:'tsp'}],
   instructions:'1. Slice tomatoes and mozzarella into rounds.\n2. Arrange alternating slices on a plate.\n3. Tuck basil leaves between slices.\n4. Drizzle with olive oil and season with salt and pepper.',
   tags:['italian','salad','vegetarian','quick']},

  {id:'r28', name:'Peanut Butter Oatmeal', category:'Breakfast', cookTime:10,
   ingredients:[{n:'oats',q:100,u:'g'},{n:'milk',q:250,u:'ml'},{n:'peanut butter',q:2,u:'tbsp'},{n:'honey',q:1,u:'tbsp'},{n:'banana',q:1,u:'pieces'}],
   instructions:'1. Cook oats with milk over medium heat, stirring.\n2. Stir in peanut butter and honey.\n3. Top with sliced banana.\n4. Add a pinch of salt for flavor.',
   tags:['breakfast','healthy','quick']},

  {id:'r29', name:'Egg Fried Noodles', category:'Asian', cookTime:20,
   ingredients:[{n:'egg noodles',q:200,u:'g'},{n:'eggs',q:2,u:'pieces'},{n:'soy sauce',q:3,u:'tbsp'},{n:'garlic',q:2,u:'cloves'},{n:'vegetable oil',q:2,u:'tbsp'},{n:'green onions',q:3,u:'pieces'}],
   instructions:'1. Cook noodles per package instructions, drain.\n2. Heat oil in wok, scramble eggs, push aside.\n3. Add garlic, then noodles.\n4. Toss with soy sauce over high heat.\n5. Garnish with green onions.',
   tags:['asian','quick','noodles']},

  {id:'r30', name:'Stuffed Bell Peppers', category:'American', cookTime:45,
   ingredients:[{n:'bell pepper',q:4,u:'pieces'},{n:'ground beef',q:300,u:'g'},{n:'cooked rice',q:200,u:'g'},{n:'canned tomatoes',q:200,u:'g'},{n:'cheddar cheese',q:80,u:'g'},{n:'onion',q:0.5,u:'pieces'}],
   instructions:'1. Preheat oven to 375°F (190°C).\n2. Cut tops off peppers, remove seeds.\n3. Brown beef with onion, mix in rice and tomatoes.\n4. Fill peppers with mixture, top with cheese.\n5. Bake 25-30 min until peppers are tender.',
   tags:['american','comfort','classic']},

  {id:'r31', name:'Oatmeal with Fruit', category:'Breakfast', cookTime:10,
   ingredients:[{n:'oats',q:100,u:'g'},{n:'milk',q:250,u:'ml'},{n:'banana',q:1,u:'pieces'},{n:'honey',q:1,u:'tbsp'}],
   instructions:'1. Cook oats with milk until thickened.\n2. Transfer to bowl.\n3. Top with sliced banana and drizzle of honey.\n4. Add any other fruit you have on hand.',
   tags:['breakfast','healthy','quick']},

  {id:'r32', name:'Chili Con Carne', category:'American', cookTime:50,
   ingredients:[{n:'ground beef',q:500,u:'g'},{n:'kidney beans',q:400,u:'g'},{n:'canned tomatoes',q:400,u:'g'},{n:'onion',q:1,u:'pieces'},{n:'garlic',q:3,u:'cloves'},{n:'chili powder',q:2,u:'tbsp'},{n:'cumin',q:1,u:'tsp'}],
   instructions:'1. Brown beef with onion and garlic.\n2. Add chili powder and cumin, cook 1 min.\n3. Stir in tomatoes and kidney beans.\n4. Simmer 30 min, stirring occasionally.\n5. Serve with sour cream and shredded cheese.',
   tags:['american','comfort','spicy']},

  {id:'r33', name:'Chicken Caesar Salad', category:'American', cookTime:20,
   ingredients:[{n:'chicken breast',q:300,u:'g'},{n:'lettuce',q:200,u:'g'},{n:'parmesan cheese',q:40,u:'g'},{n:'croutons',q:50,u:'g'},{n:'caesar dressing',q:3,u:'tbsp'}],
   instructions:'1. Season and cook chicken breast, let rest and slice.\n2. Chop romaine lettuce.\n3. Toss lettuce with caesar dressing.\n4. Top with chicken, croutons, and parmesan.\n5. Serve immediately.',
   tags:['salad','american','healthy']},

  {id:'r34', name:'Pork Fried Rice', category:'Asian', cookTime:25,
   ingredients:[{n:'cooked rice',q:300,u:'g'},{n:'pork',q:200,u:'g'},{n:'eggs',q:2,u:'pieces'},{n:'soy sauce',q:3,u:'tbsp'},{n:'garlic',q:2,u:'cloves'},{n:'vegetable oil',q:2,u:'tbsp'},{n:'green onions',q:2,u:'pieces'}],
   instructions:'1. Dice pork and cook in oiled wok until golden.\n2. Push aside, scramble eggs.\n3. Add garlic, then cold rice.\n4. Toss with soy sauce over high heat.\n5. Top with green onions.',
   tags:['asian','quick','pork']},

  {id:'r35', name:'Tuna Pasta Salad', category:'American', cookTime:15,
   ingredients:[{n:'pasta',q:200,u:'g'},{n:'canned tuna',q:200,u:'g'},{n:'mayonnaise',q:3,u:'tbsp'},{n:'celery',q:2,u:'stalks'},{n:'onion',q:0.25,u:'pieces'},{n:'lemon',q:0.5,u:'pieces'}],
   instructions:'1. Cook pasta, drain and cool.\n2. Drain tuna, flake into bowl.\n3. Dice celery and onion finely.\n4. Mix pasta, tuna, celery, onion with mayo.\n5. Squeeze lemon, season with salt and pepper.',
   tags:['american','cold','lunch']}
];
