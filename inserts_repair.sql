-- Clear recipes_ingredients first due to FK dependency on recipes
TRUNCATE TABLE recipes_ingredients RESTART IDENTITY;

-- Then clear recipes
TRUNCATE TABLE recipes RESTART IDENTITY;

-- Insert fresh recipes
INSERT INTO recipes (name, steps) VALUES
('Banana Bread', '1. Mash bananas. 2. Mix wet ingredients. 3. Stir in dry ingredients. 4. Bake at 350°F for 60 mins.'),
('Butter Banana Bread', '1. Mash bananas. 2. Brown butter. 3. Mix ingredients. 4. Bake at 350°F for 55 mins.'),
('Buttermilk Fried Chicken', '1. Marinate chicken in buttermilk. 2. Coat in flour. 3. Fry until golden.');

-- Reinsert ingredients using subqueries to ensure correct matching

-- Recipe 1
INSERT INTO recipes_ingredients (ingredient_id, recipe_id, measure, uom, instruction)
VALUES 
((SELECT id FROM ingredients WHERE name = 'banana'), 1, 2.33, 'cups', 'medium, mashed'),
((SELECT id FROM ingredients WHERE name = 'brown sugar'), 1, 0.75, 'cups', 'packed'),
((SELECT id FROM ingredients WHERE name = 'egg'), 1, 2, NULL, 'large, beaten'),
((SELECT id FROM ingredients WHERE name = 'all-purpose flour'), 1, 2, 'cups', NULL),
((SELECT id FROM ingredients WHERE name = 'butter'), 1, 0.5, 'cups', 'melted'),
((SELECT id FROM ingredients WHERE name = 'baking soda'), 1, 1, 'tsp', NULL),
((SELECT id FROM ingredients WHERE name = 'salt'), 1, 0.25, 'tsp', NULL);

-- Recipe 2
INSERT INTO recipes_ingredients (ingredient_id, recipe_id, measure, uom, instruction)
VALUES 
((SELECT id FROM ingredients WHERE name = 'banana'), 2, 2.33, 'cups', 'medium, mashed'),
((SELECT id FROM ingredients WHERE name = 'brown sugar'), 2, 0.75, 'cups', 'packed'),
((SELECT id FROM ingredients WHERE name = 'egg'), 2, 2, NULL, 'jumbo, beaten'),
((SELECT id FROM ingredients WHERE name = 'all-purpose flour'), 2, 2, 'cups', NULL),
((SELECT id FROM ingredients WHERE name = 'butter'), 2, 0.5, 'cups', 'browned'),
((SELECT id FROM ingredients WHERE name = 'baking soda'), 2, 1, 'tsp', NULL),
((SELECT id FROM ingredients WHERE name = 'salt'), 2, 0.25, 'tsp', NULL);

-- Recipe 3
INSERT INTO recipes_ingredients (ingredient_id, recipe_id, measure, uom, instruction)
VALUES 
((SELECT id FROM ingredients WHERE name = 'chicken'), 3, 3, 'lbs', 'bone-in, skin-on'),
((SELECT id FROM ingredients WHERE name = 'buttermilk'), 3, 2, 'cups', NULL),
((SELECT id FROM ingredients WHERE name = 'salt'), 3, 1, 'tsp', NULL),
((SELECT id FROM ingredients WHERE name = 'paprika'), 3, 0.5, 'tsp', NULL);
