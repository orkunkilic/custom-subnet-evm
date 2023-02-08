// Code generated
// This file is a generated precompile contract with stubbed abstract functions.
// The file is generated by a template. Please inspect every code and comment in this file before use.

// There are some must-be-done changes waiting in the file. Each area requiring you to add your code is marked with CUSTOM CODE to make them easy to find and modify.
// Additionally there are other files you need to edit to activate your precompile.
// These areas are highlighted with comments "ADD YOUR PRECOMPILE HERE".
// For testing take a look at other precompile tests in core/stateful_precompile_test.go

/* General guidelines for precompile development:
1- Read the comment and set a suitable contract address in precompile/params.go. E.g:
	GasRevenueAddress = common.HexToAddress("ASUITABLEHEXADDRESS")
2- Set gas costs here
3- It is recommended to only modify code in the highlighted areas marked with "CUSTOM CODE STARTS HERE". Modifying code outside of these areas should be done with caution and with a deep understanding of how these changes may impact the EVM.
Typically, custom codes are required in only those areas.
4- Add your upgradable config in params/precompile_config.go
5- Add your precompile upgrade in params/config.go
6- Add your solidity interface and test contract to contract-examples/contracts
7- Write solidity tests for your precompile in contract-examples/test
8- Create your genesis with your precompile enabled in tests/e2e/genesis/
9- Create e2e test for your solidity test in tests/e2e/solidity/suites.go
10- Run your e2e precompile Solidity tests with './scripts/run_ginkgo.sh'

*/

package precompile

import (
	"encoding/json"
	"errors"
	"fmt"
	"math/big"
	"strings"

	"github.com/ava-labs/subnet-evm/accounts/abi"
	"github.com/ava-labs/subnet-evm/vmerrs"

	"github.com/ethereum/go-ethereum/common"
)

const (
	BalanceOfGasCost uint64 = 0      // SET A GAS COST HERE
	WithdrawGasCost  uint64 = 50_000 // SET A GAS COST HERE

	// GasRevenueRawABI contains the raw ABI of GasRevenue contract.
	GasRevenueRawABI = "[{\"inputs\":[{\"internalType\":\"address\",\"name\":\"contractAddress\",\"type\":\"address\"}],\"name\":\"balanceOf\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"balance\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"contractAddress\",\"type\":\"address\"}],\"name\":\"withdraw\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]"
)

// CUSTOM CODE STARTS HERE
// Reference imports to suppress errors from unused imports. This code and any unnecessary imports can be removed.
var (
	_ = errors.New
	_ = big.NewInt
	_ = strings.NewReader
	_ = fmt.Printf
)

// Singleton StatefulPrecompiledContract and signatures.
var (
	_ StatefulPrecompileConfig = &GasRevenueConfig{}

	GasRevenueABI abi.ABI // will be initialized by init function

	GasRevenuePrecompile StatefulPrecompiledContract // will be initialized by init function

	// CUSTOM CODE STARTS HERE
	// THIS SHOULD BE MOVED TO precompile/params.go with a suitable hex address.
	// GasRevenueAddress = common.HexToAddress("ASUITABLEHEXADDRESS")
)

// GasRevenueConfig implements the StatefulPrecompileConfig
// interface while adding in the GasRevenue specific precompile address.
type GasRevenueConfig struct {
	UpgradeableConfig
}

func init() {
	parsed, err := abi.JSON(strings.NewReader(GasRevenueRawABI))
	if err != nil {
		panic(err)
	}
	GasRevenueABI = parsed

	GasRevenuePrecompile = createGasRevenuePrecompile(GasRevenueAddress)
}

// NewGasRevenueConfig returns a config for a network upgrade at [blockTimestamp] that enables
// GasRevenue .
func NewGasRevenueConfig(blockTimestamp *big.Int) *GasRevenueConfig {
	return &GasRevenueConfig{

		UpgradeableConfig: UpgradeableConfig{BlockTimestamp: blockTimestamp},
	}
}

// NewDisableGasRevenueConfig returns config for a network upgrade at [blockTimestamp]
// that disables GasRevenue.
func NewDisableGasRevenueConfig(blockTimestamp *big.Int) *GasRevenueConfig {
	return &GasRevenueConfig{
		UpgradeableConfig: UpgradeableConfig{
			BlockTimestamp: blockTimestamp,
			Disable:        true,
		},
	}
}

// Equal returns true if [s] is a [*GasRevenueConfig] and it has been configured identical to [c].
func (c *GasRevenueConfig) Equal(s StatefulPrecompileConfig) bool {
	// typecast before comparison
	other, ok := (s).(*GasRevenueConfig)
	if !ok {
		return false
	}
	// CUSTOM CODE STARTS HERE
	// modify this boolean accordingly with your custom GasRevenueConfig, to check if [other] and the current [c] are equal
	// if GasRevenueConfig contains only UpgradeableConfig  you can skip modifying it.
	equals := c.UpgradeableConfig.Equal(&other.UpgradeableConfig)
	return equals
}

// String returns a string representation of the GasRevenueConfig.
func (c *GasRevenueConfig) String() string {
	bytes, _ := json.Marshal(c)
	return string(bytes)
}

// Address returns the address of the GasRevenue. Addresses reside under the precompile/params.go
// Select a non-conflicting address and set it in the params.go.
func (c *GasRevenueConfig) Address() common.Address {
	return GasRevenueAddress
}

// Configure configures [state] with the initial configuration.
func (c *GasRevenueConfig) Configure(_ ChainConfig, state StateDB, _ BlockContext) {
	// This will be called in the first block where HelloWorld stateful precompile is enabled.
	// 1) If BlockTimestamp is nil, this will not be called
	// 2) If BlockTimestamp is 0, this will be called while setting up the genesis block
	// 3) If BlockTimestamp is 1000, this will be called while processing the first block
	// whose timestamp is >= 1000
	//
	// Set the initial value under [common.BytesToHash([]byte("storageKey")] to "Hello World!"
	res := common.LeftPadBytes([]byte("GasRevenue"), common.HashLength)
	state.SetState(GasRevenueAddress, common.BytesToHash([]byte("storageKey")), common.BytesToHash(res))
}

// Contract returns the singleton stateful precompiled contract to be used for GasRevenue.
func (c *GasRevenueConfig) Contract() StatefulPrecompiledContract {
	return GasRevenuePrecompile
}

// Verify tries to verify GasRevenueConfig and returns an error accordingly.
func (c *GasRevenueConfig) Verify() error {

	// CUSTOM CODE STARTS HERE
	// Add your own custom verify code for GasRevenueConfig here
	// and return an error accordingly
	return nil
}

// UnpackBalanceOfInput attempts to unpack [input] into the common.Address type argument
// assumes that [input] does not include selector (omits first 4 func signature bytes)
func UnpackBalanceOfInput(input []byte) (common.Address, error) {
	res, err := GasRevenueABI.UnpackInput("balanceOf", input)
	if err != nil {
		return common.Address{}, err
	}
	unpacked := *abi.ConvertType(res[0], new(common.Address)).(*common.Address)
	return unpacked, nil
}

// PackBalanceOf packs [contractAddress] of type common.Address into the appropriate arguments for balanceOf.
// the packed bytes include selector (first 4 func signature bytes).
// This function is mostly used for tests.
func PackBalanceOf(contractAddress common.Address) ([]byte, error) {
	return GasRevenueABI.Pack("balanceOf", contractAddress)
}

// PackBalanceOfOutput attempts to pack given balance of type *big.Int
// to conform the ABI outputs.
func PackBalanceOfOutput(balance *big.Int) ([]byte, error) {
	return GasRevenueABI.PackOutput("balanceOf", balance)
}

func balanceOf(accessibleState PrecompileAccessibleState, caller common.Address, addr common.Address, input []byte, suppliedGas uint64, readOnly bool) (ret []byte, remainingGas uint64, err error) {
	if remainingGas, err = deductGas(suppliedGas, BalanceOfGasCost); err != nil {
		return nil, 0, err
	}
	// attempts to unpack [input] into the arguments to the BalanceOfInput.
	// Assumes that [input] does not include selector
	// You can use unpacked [inputStruct] variable in your code
	inputStruct, err := UnpackBalanceOfInput(input)
	if err != nil {
		return nil, remainingGas, err
	}

	// CUSTOM CODE STARTS HERE
	value := accessibleState.GetStateDB().GetState(GasRevenueAddress, common.BytesToHash(inputStruct[:]))

	output := value.Big()
	packedOutput, err := PackBalanceOfOutput(output)
	if err != nil {
		return nil, remainingGas, err
	}

	// Return the packed output and the remaining gas
	return packedOutput, remainingGas, nil
}

// UnpackWithdrawInput attempts to unpack [input] into the common.Address type argument
// assumes that [input] does not include selector (omits first 4 func signature bytes)
func UnpackWithdrawInput(input []byte) (common.Address, error) {
	res, err := GasRevenueABI.UnpackInput("withdraw", input)
	if err != nil {
		return common.Address{}, err
	}
	unpacked := *abi.ConvertType(res[0], new(common.Address)).(*common.Address)
	return unpacked, nil
}

// PackWithdraw packs [contractAddress] of type common.Address into the appropriate arguments for withdraw.
// the packed bytes include selector (first 4 func signature bytes).
// This function is mostly used for tests.
func PackWithdraw(contractAddress common.Address) ([]byte, error) {
	return GasRevenueABI.Pack("withdraw", contractAddress)
}

func withdraw(accessibleState PrecompileAccessibleState, caller common.Address, addr common.Address, input []byte, suppliedGas uint64, readOnly bool) (ret []byte, remainingGas uint64, err error) {
	if remainingGas, err = deductGas(suppliedGas, WithdrawGasCost); err != nil {
		return nil, 0, err
	}
	if readOnly {
		return nil, remainingGas, vmerrs.ErrWriteProtection
	}
	// attempts to unpack [input] into the arguments to the WithdrawInput.
	// Assumes that [input] does not include selector
	// You can use unpacked [inputStruct] variable in your code
	inputStruct, err := UnpackWithdrawInput(input)
	if err != nil {
		return nil, remainingGas, err
	}

	// CUSTOM CODE STARTS HERE
	value := accessibleState.GetStateDB().GetState(GasRevenueAddress, common.BytesToHash(inputStruct[:]))
	accessibleState.GetStateDB().SubBalance(GasRevenueAddress, value.Big())
	accessibleState.GetStateDB().AddBalance(caller, value.Big())

	accessibleState.GetStateDB().SetState(GasRevenueAddress, common.BytesToHash(inputStruct[:]), common.BytesToHash([]byte{}))

	// this function does not return an output, leave this one as is
	packedOutput := []byte{}

	// Return the packed output and the remaining gas
	return packedOutput, remainingGas, nil
}

// createGasRevenuePrecompile returns a StatefulPrecompiledContract with getters and setters for the precompile.

func createGasRevenuePrecompile(precompileAddr common.Address) StatefulPrecompiledContract {
	var functions []*statefulPrecompileFunction

	methodBalanceOf, ok := GasRevenueABI.Methods["balanceOf"]
	if !ok {
		panic("given method does not exist in the ABI")
	}
	functions = append(functions, newStatefulPrecompileFunction(methodBalanceOf.ID, balanceOf))

	methodWithdraw, ok := GasRevenueABI.Methods["withdraw"]
	if !ok {
		panic("given method does not exist in the ABI")
	}
	functions = append(functions, newStatefulPrecompileFunction(methodWithdraw.ID, withdraw))

	// Construct the contract with no fallback function.
	contract := newStatefulPrecompileWithFunctionSelectors(nil, functions)
	return contract
}