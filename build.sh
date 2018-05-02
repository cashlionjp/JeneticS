mkdir -p "$(pwd)/dist/"
touch "$(pwd)/dist/JeneticS.js"
cat "$(pwd)/src/JeneticS.js" > "$(pwd)/docs/dist/JeneticS.js"
echo "\n\n" >> "$(pwd)/dist/JeneticS.js"
cat "$(pwd)/src/Culture.js" >> "$(pwd)/docs/dist/JeneticS.js"
echo "\n\n" >> "$(pwd)/dist/JeneticS.js"
cat "$(pwd)/src/Agent.js" >> "$(pwd)/docs/dist/JeneticS.js"
uglifyjs "$(pwd)/docs/dist/JeneticS.js" -o "$(pwd)/docs/dist/JeneticS.min.js" -m -c