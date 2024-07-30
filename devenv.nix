{ pkgs, lib, config, inputs, ... }:

{
  packages = [ pkgs.git pkgs.bun ];
  dotenv.disableHint = true;
}
