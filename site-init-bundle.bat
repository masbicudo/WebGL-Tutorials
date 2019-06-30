@echo off
echo.source 'https://rubygems.org'>Gemfile
echo.gem 'github-pages', group: :jekyll_plugins>>Gemfile
bundle install
