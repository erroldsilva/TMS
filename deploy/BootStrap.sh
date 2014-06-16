USER_HOME=$(eval echo ~${SUDO_USER})
echo "Making Use of ${USER_HOME} Directory."
echo 'Updateing repo'
sudo apt-get update
echo 'Checking if Ruby Gems and other necessary packages are installed'
if ! command -v gem >/dev/null || ! command -v unzip >/dev/null ; then
    	echo 'Installing Ruby an its dependencies as its not found to be installed;'
	sudo apt-get -q -y install ruby1.9.1 ruby1.9.1-dev build-essential unzip 
else
    	echo 'Ruby Installed Moving on;'
fi;
echo 'Checking if Gems:: chef-solo knife-solo are installed;'
if ! command -v ohai >/dev/null && ! command -v chef-solo >/dev/null  && ! command -v knife-solo >/dev/null; then
	echo 'Installing Chef and Knife Solo'
	sudo gem install chef ohai knife-solo --no-ri --no-rdoc
else 
	echo 'Moving on.. Chef & knife Solo Installed'
fi

if [!'($command -v git)']; then
	sudo apt-get install git
fi

echo 'If there is a folder chef repo deleting the same ;)'
rm -rf  ${USER_HOME}/chef-repo
echo 'Creating a repo'
mkdir ${USER_HOME}/chef-repo
mkdir ${USER_HOME}/.chef
#cd ~/chef-repo
echo 'Fetching the Contents to put in chef-repo'
pwd
wget  http://github.com/opscode/chef-repo/tarball/master
echo 'Unzipping the tarball and moving it to the needed folder; and deleting the tar'
tar -zxf master
mv opscode-chef-repo-*/* ${USER_HOME}/chef-repo
rm master
echo 'Creating the Run List to install Node & Mongo; Initiating a basic install'
touch  ${USER_HOME}/.chef/knife.rb
touch  ${USER_HOME}/chef-repo/recipelist.json
touch  ${USER_HOME}/chef-repo/chef-solo-config.rb
printf "cookbook_path [ '${USER_HOME}/chef-repo/cookbooks']"  >  ${USER_HOME}/.chef/knife.rb
printf '\n{\n"run_list": [\n"recipe[git]",\n"recipe[mongodb]",\n"recipe[nodejs]",\n"recipe[TMS_Deploy]" ]\n}' >  ${USER_HOME}/chef-repo/recipelist.json
printf "cookbook_path '${USER_HOME}/chef-repo/cookbooks' \nfile_cache_path '${USER_HOME}/chef-repo'" >   ${USER_HOME}/chef-repo/chef-solo-config.rb
echo 'Creating a temp place to download the cookbook tar balls'

cd ${USER_HOME}/chef-repo/cookbooks
echo 'Fetching Mongo & Node Cookbooks using knife'
knife cookbook site download apt
knife cookbook site download python
knife cookbook site download runit
knife cookbook site download yum
knife cookbook site download yum-epel
knife cookbook site download build-essential
knife cookbook site download dmg
knife cookbook site download chef_handler
knife cookbook site download windows
knife cookbook site download git
knife cookbook site download mongodb
knife cookbook site download nodejs
for file in ${USER_HOME}/chef-repo/cookbooks/*; do   tar -xvf  ${file##*/}; done

echo 'Downloading TMS Deploy Cookbook'	
mkdir ${USER_HOME}/chef-repo/tmp/
wget -P ${USER_HOME}/chef-repo/tmp/ https://codeload.github.com/erroldsilva/TMS_Chef/zip/master
unzip ${USER_HOME}/chef-repo/tmp/master -d ${USER_HOME}/chef-repo/tmp/
mkdir ${USER_HOME}/chef-repo/cookbooks/TMS_Deploy/
mv ${USER_HOME}/chef-repo/tmp/TMS_Chef*/* ${USER_HOME}/chef-repo/cookbooks/TMS_Deploy/
echo 'Bootstrapping With Chef Solo'
sudo chef-solo -c ${USER_HOME}/chef-repo/chef-solo-config.rb -j ${USER_HOME}/chef-repo/recipelist.json


