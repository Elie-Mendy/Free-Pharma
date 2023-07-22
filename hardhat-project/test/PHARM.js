const { expect } = require('chai');

describe("TokenPHARM", function() {
  let TokenPHARM;
  let token;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function() {
    TokenPHARM = await ethers.getContractFactory("TokenPHARM");
    [owner, addr1, addr2] = await ethers.getSigners();

    token = await TokenPHARM.deploy();
    await token.deployed();
  });

  it("Should have correct name, symbol, and initial supply", async function() {
    const name = await token.name();
    const symbol = await token.symbol();
    const totalSupply = await token.totalSupply();

    expect(name).to.equal("TokenPHARM");
    expect(symbol).to.equal("PHARM");
    expect(totalSupply.toString()).to.equal(ethers.utils.parseEther("1000000"));
  });

  it("Should grant roles to the deployer", async function() {
    const pauserRole = await token.PAUSER_ROLE();
    const minterRole = await token.MINTER_ROLE();
    const isPauser = await token.hasRole(pauserRole, owner.address);
    const isMinter = await token.hasRole(minterRole, owner.address);

    expect(isPauser).to.be.true;
    expect(isMinter).to.be.true;
  });

  it("Should mint tokens", async function() {
    const initialBalance = await token.balanceOf(addr1.address);
    const amountToMint = 100;
    await token.connect(owner).mint(addr1.address, amountToMint);
    const finalBalance = await token.balanceOf(addr1.address);

    expect(finalBalance).to.equal(initialBalance.add(amountToMint));
  });

  it("Should not allow minting tokens by non-minter", async function() {
    const nonMinter = addr2;

    await expect(
      token.connect(nonMinter).mint(addr1.address, 100)
    ).to.be.reverted;
  });
});