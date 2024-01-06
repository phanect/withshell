module greetings {
  export def hello [name: string] {
    $"hello ($name)!"
  }

  export def hi [name: string] {
    $"hi ($name)!"
  }
}
