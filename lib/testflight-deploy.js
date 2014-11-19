var execSync = require('execSync');

function formTestflightCurlCommand(apiToken, teamToken, appPath, dsymPath, notes, distributionLists) {
    var deployCurlCommand = 'curl http://testflightapp.com/api/builds.json \
    -F file=@' + appPath +
        // ' -F dsym=@' + dsymPath +
        ' -F api_token="' + apiToken + '" \
     -F team_token="' + teamToken + '" \
     -F notes="' + notes + '" \
     -F notify=True \
     -F distribution_lists="' + distributionLists + '"';

    // console.log('Deploy curl command => ' + deployCurlCommand);

    return deployCurlCommand;
}



function formTestfairyCurlCommand(apiToken, teamToken, appPath, dsymPath, notes, distributionLists) {
    var deployCurlCommand = 'curl https://app.testfairy.com/api/upload/ \
    -F file=@' + appPath +
        // ' -F dsym=@' + dsymPath +
        ' -F api_key="' + apiToken + '" \
     -F comment="' + notes + '" \
     -F notify=True \
     -F testers_groups="' + distributionLists + '"';

    // console.log('Deploy curl command => ' + deployCurlCommand);

    return deployCurlCommand;
}

function deployIos(apiToken, teamToken, ipaPath, dsymPath, notes, distributionLists) {
    var curlCommand = formTestflightCurlCommand(apiToken, teamToken, ipaPath, dsymPath, notes, distributionLists);

    console.log('Uploading iOS to TestFlight'.yellow.bold);
    var result = execSync.exec(curlCommand);
    console.log('Upload iOS to TestFlight completed'.green);
    console.log('Result: ' + result.stdout);
    return result;
}

function deployAndroid(apiToken, teamToken, apkPath, notes, distributionLists) {
    var curlCommand = formTestfairyCurlCommand(apiToken, teamToken, apkPath, notes, distributionLists);

    console.log('Uploading Android to TestFairy'.yellow.bold);
    var result = execSync.exec(curlCommand);
    console.log('Upload Android to TestFairy completed'.green);

    var response = getResponseObject(result);

    console.log('APK can be downloaded from: ' + response.instrumented_url + ''.green);
    // console.log('Result: ' + result.stdout);
    return result;
}

function getResponseObject(response) {
    var stdout = response.stdout;

    var re = /(\{.*\})/;
    var m, out = false;;

    if ((m = re.exec(stdout)) != null) {
        out = JSON.parse(m[0]);
    }
    return out;

}

module.exports = {
    deployIos: deployIos,
    deployAndroid: deployAndroid,
};