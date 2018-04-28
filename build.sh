mkdir -p "$(pwd)/dist/"
touch "$(pwd)/dist/JeneticS.js"
cat "$(pwd)/JeneticS.js" > "$(pwd)/dist/JeneticS.js"
echo "\n\n" >> "$(pwd)/dist/JeneticS.js"
cat "$(pwd)/Culture.js" >> "$(pwd)/dist/JeneticS.js"
echo "\n\n" >> "$(pwd)/dist/JeneticS.js"
cat "$(pwd)/Agent.js" >> "$(pwd)/dist/JeneticS.js"
uglifyjs "$(pwd)/dist/JeneticS.js" -o "$(pwd)/dist/JeneticS.min.js" -m -c