export def assertGitUserInfo [username: string, email: string] {
  if "$(build-string $(git config --get user.name))" == username {
    echo "Git username is $(username) as expected"
  } else {
    echo "Git username has unexpected value.\nExpected: $(username)\nActual: $(build-string $(git config --get user.name))"
  }

  if "$(build-string $(git config --get user.email))" == email {
    echo "Git email is $(email) as expected"
  } else {
    echo "Git email has unexpected value.\nExpected: $(email)\nActual: $(build-string $(git config --get user.email))"
  }
}

export def showGitUserInfo [] {
  echo $"Git username: (git config --get user.name)"
  echo $"Git email: (git config --get user.email)"
}
