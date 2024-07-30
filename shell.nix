# Create nix shell for reproducable build environments

{ pkgs ? import <nixpkgs> {} }:
  pkgs.mkShell {
	# Include bun
	nativeBuildInputs = with pkgs.buildPackages; [ bun ];
}