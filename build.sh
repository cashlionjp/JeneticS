mkdir -p "$(pwd)/dist/"
touch "$(pwd)/dist/JeneticS.js"
cat "$(pwd)/src/JeneticS.js" > "$(pwd)/dist/JeneticS.js"
echo "\n\n" >> "$(pwd)/dist/JeneticS.js"
cat "$(pwd)/src/Culture.js" >> "$(pwd)/dist/JeneticS.js"
echo "\n\n" >> "$(pwd)/dist/JeneticS.js"
cat "$(pwd)/src/Agent.js" >> "$(pwd)/dist/JeneticS.js"
uglifyjs "$(pwd)/dist/JeneticS.js" -o "$(pwd)/dist/JeneticS.min.js" -m -c