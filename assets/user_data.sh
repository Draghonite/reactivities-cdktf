apt-get update
apt-get install -y nginx

snap install dotnet-sdk --classic --channel=6.0
snap alias dotnet-sdk.dotnet dotnet
snap install dotnet-runtime-60 --classic
snap alias dotnet-runtime-60.dotnet dotnet
export DOTNET_ROOT=/snap/dotnet-sdk/current
