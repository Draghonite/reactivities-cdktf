import { LightsailInstance } from './.gen/providers/aws/lightsail-instance/index';
import { AwsProvider } from './.gen/providers/aws/provider/index';
import { Construct } from "constructs";
import { App, TerraformOutput, TerraformStack } from "cdktf";
import * as fs from "fs";
import * as path from "path";

class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const defaults = {
        region: "us-east-1",
        availabilityZone: "us-east-1a",
        blueprintId: "ubuntu_20_04",
        bundleId: "nano_2_0",
        env: "dev"
    };
    let options: any = {};
    if (process?.env?.AWS_REGION) { options.region = process?.env?.AWS_REGION; }
    if (process?.env?.AWS_AVAILABILITY_ZONE) { options.availabilityZone = process?.env?.AWS_AVAILABILITY_ZONE; }
    if (process?.env?.AWS_BLUEPRINT_ID) { options.blueprintId = process?.env?.AWS_BLUEPRINT_ID; }
    if (process?.env?.AWS_BUNDLE_ID) { options.bundleId = process?.env?.AWS_BUNDLE_ID; }
    if (process?.env?.DEPLOY_ENV) { options.env = process?.env?.DEPLOY_ENV; }
    const config = Object.assign({}, defaults, options);

    new AwsProvider(this, "AWS", {
        region: config.region
    });

    const instance = new LightsailInstance(this, "ReactivitiesLightsailInstance", {
        name: `Reactivities_${config.env}_${config.region}`,
        availabilityZone: config.availabilityZone,
        blueprintId: config.blueprintId,
        bundleId: config.bundleId,
        tags: {
            "AplicationId": "Reactivities"
        },
        userData: fs.readFileSync(path.join(__dirname, "./assets/user_data.sh"), "utf-8")
    });

    new TerraformOutput(this, "ReactivitiesPublicIP", {
        value: instance.publicIpAddress
    });
  }
}

const app = new App();
new MyStack(app, "reactivities-cdktf");
app.synth();
