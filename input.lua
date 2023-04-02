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
    local element = createElement("li", className, text)
    list:appendChild(element)
  end
  return button
end

local goodButton = addButton("Good", "good", "button")
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
