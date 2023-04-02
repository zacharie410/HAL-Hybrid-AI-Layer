local js = require("js")
local document = js.global.document

local function createElement(tagName, className, textContent)
  local element = document:createElement(tagName)
  element.className = className or ""
  element.textContent = textContent or ""
  return element
end

local function addButton(text, className, type)
  local button = createElement("button", className, text)
  button.type = type
  button.onclick = function()
    local list = document:getElementById("list")
    local element = createElement("li", className, className)
    list:appendChild(element)
  end
  return button
end

local goodButton = addButton("Positive", "good", "button")
local neutralButton = addButton("Neutral", "neutral", "button")
local badButton = addButton("Bad", "bad", "button")

local div = createElement("div")
div:appendChild(goodButton)
div:appendChild(neutralButton)
div:appendChild(badButton)
document.body:appendChild(div)

local list = createElement("ul", "list")
list.id = "list"
document.body:appendChild(list)

function make(ty)
    local list = document:getElementById("list")
    local element = createElement("li", "", ty)
    list:appendChild(element)
end

make("good")
make("good")
make("good")
make("neutral")
make("bad")

function Scan()
    local good_count, bad_count, neutral_count = 0, 0, 0
    for _, element in ipairs(js.global.document:getElementsByTagName("*")) do
        local text = element.textContent:lower()
        if text:find("good") then
            good_count = good_count + 1
        elseif text:find("bad") then
            bad_count = bad_count + 1
        elseif text:find("neutral") then
            neutral_count = neutral_count + 1
        end
    end
    if good_count > 1 and good_count < bad_count then
        local dom_elements = js.global.document:getElementsByTagName("*")
        for i = dom_elements.length - 1, 0, -1 do
          local element = dom_elements[i]
          if element ~= div and element.textContent:lower():find("good") then
            element:remove()
            print("Attacked good element:", element)
            break
          end
        end
      end
      

end

js.global:setInterval(Scan, 1000) -- Run every second
